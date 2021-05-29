import db from '../../../database/models/index';
import {ethers} from 'ethers';

const Provider = db.provider;

const userAddress = '0x8330D58cC6458a1579F11f68E466829f1d19c78c';
const ChainProvider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed2.binance.org');

const investmentsSnapshot = [];

export async function buildFarmsSnapshot(userAddress) {
  const providers = await Provider.findAll(); //TODO: filter enabled providers

  for (const provider of providers) {
    const contracts = await provider.getMasterContracts();

    const providerSnapshot = {
      provider: provider.name,
      farms: [],
    };

    for (const contract of contracts) {
      const chefContract = new ethers.Contract(contract.address, contract.abi, ChainProvider);
      const pools = await contract.getPools();

      //get user info from all pools
      const poolUserInfos = await Promise.all([...Array(pools.length).keys()].map(async (poolId) =>
          [poolId, await chefContract.userInfo(poolId, userAddress)]));

      //get active pools
      const activePools = poolUserInfos.filter((info, i) => {
        return ethers.utils.formatEther(info[1].amount) > 0;
      });

      //for each active pool, get data and put it in the snapshot
      for (const pool of activePools) {
        const poolId = pool[0];
        const deposit = ethers.utils.formatEther(pool[1].amount);
        const pendingRewardTokens = await chefContract.callStatic[contract.pendingTokenMethod](poolId, userAddress);

        let farmSnapshot = {
          farmInfo: {
            contract: contract.name,
            pool: poolId,
            data: 'info despre ferma, APR, etc',  //le avem salvate deja - facem query in DB poate
          },
          deposit: {
            amount: deposit,
            token: pools[poolId].poolToken,
          },
          pending: {
            amount: ethers.utils.formatEther(pendingRewardTokens),
            token: contract.token,
          },
        };
        providerSnapshot.farms.push(farmSnapshot);
      }
    }

    if (providerSnapshot.farms.length) {
      investmentsSnapshot.push(providerSnapshot);
    }
  }
  return investmentsSnapshot;
}

export default async (req, res) => {

  let data = await buildFarmsSnapshot(userAddress);
  console.info(data);
  res.status(200).json(data);
}

/*
  CALCUL APR

     const rewardsPerWeek = await PANTHER_CHEF.pantherPerBlock() / 1e18 * 604800 / 3;

  const totalAllocPoints = await chefContract.totalAllocPoint();
    const rewardsPerWeek = rewardsPerWeekFixed ?? await chefContract.callStatic[rewardsPerBlockFunction]() / 10 ** rewardToken.decimals * 604800 / 3
    var poolRewardsPerWeek = poolInfo.allocPoints / totalAllocPoints * rewardsPerWeek;

  userStaked -> cate tokene sunt staked

  var usdPerWeek = poolRewardsPerWeek * rewardPrice;

  var weeklyAPR = usdPerWeek / staked_tvl * 100; -> weekly APR %

  var userStakedPct = userStakedUsd / staked_tvl * 100;
  var userWeeklyRewards = userStakedPct * poolRewardsPerWeek / 100;



function printChefPool(App, chefAbi, chefAddr, prices, tokens, poolInfo, poolIndex, poolPrices,
                       totalAllocPoints, rewardsPerWeek, rewardTokenTicker, rewardTokenAddress,
                       pendingRewardsFunction, fixedDecimals, claimFunction, chain="eth") {
  fixedDecimals = fixedDecimals ?? 2;
  const sp = (poolInfo.stakedToken == null) ? null : getPoolPrices(tokens, prices, poolInfo.stakedToken);
  var poolRewardsPerWeek = poolInfo.allocPoints / totalAllocPoints * rewardsPerWeek;
  if (poolRewardsPerWeek == 0 && rewardsPerWeek != 0) return;
  const userStaked = poolInfo.userLPStaked ?? poolInfo.userStaked;
  const rewardPrice = getParameterCaseInsensitive(prices, rewardTokenAddress)?.usd;
  const staked_tvl = sp?.staked_tvl ?? poolPrices.staked_tvl;
  poolPrices.print_price(chain);
  sp?.print_price(chain);
  const apr = printAPR(rewardTokenTicker, rewardPrice, poolRewardsPerWeek, poolPrices.stakeTokenTicker,
      staked_tvl, userStaked, poolPrices.price, fixedDecimals);
  if (poolInfo.userLPStaked > 0) sp?.print_contained_price(userStaked);
  if (poolInfo.userStaked > 0) poolPrices.print_contained_price(userStaked);
  printChefContractLinks(App, chefAbi, chefAddr, poolIndex, poolInfo.address, pendingRewardsFunction,
      rewardTokenTicker, poolPrices.stakeTokenTicker, poolInfo.poolToken.unstaked,
      poolInfo.userStaked, poolInfo.pendingRewardTokens, fixedDecimals, claimFunction, rewardPrice, chain);
  return apr;
}


function printAPR(rewardTokenTicker, rewardPrice, poolRewardsPerWeek,
                  stakeTokenTicker, staked_tvl, userStaked, poolTokenPrice,
                  fixedDecimals) {
  var usdPerWeek = poolRewardsPerWeek * rewardPrice;
  fixedDecimals = fixedDecimals ?? 2;
  _print(`${rewardTokenTicker} Per Week: ${poolRewardsPerWeek.toFixed(fixedDecimals)} ($${formatMoney(usdPerWeek)})`);
  var weeklyAPR = usdPerWeek / staked_tvl * 100;
  var dailyAPR = weeklyAPR / 7;
  var yearlyAPR = weeklyAPR * 52;
  _print(`APR: Day ${dailyAPR.toFixed(2)}% Week ${weeklyAPR.toFixed(2)}% Year ${yearlyAPR.toFixed(2)}%`);
  var userStakedUsd = userStaked * poolTokenPrice;
  var userStakedPct = userStakedUsd / staked_tvl * 100;
  _print(`You are staking ${userStaked.toFixed(fixedDecimals)} ${stakeTokenTicker} ($${formatMoney(userStakedUsd)}), ${userStakedPct.toFixed(2)}% of the pool.`);
  var userWeeklyRewards = userStakedPct * poolRewardsPerWeek / 100;
  var userDailyRewards = userWeeklyRewards / 7;
  var userYearlyRewards = userWeeklyRewards * 52;
  if (userStaked > 0) {
    _print(`Estimated ${rewardTokenTicker} earnings:`
        + ` Day ${userDailyRewards.toFixed(fixedDecimals)} ($${formatMoney(userDailyRewards*rewardPrice)})`
        + ` Week ${userWeeklyRewards.toFixed(fixedDecimals)} ($${formatMoney(userWeeklyRewards*rewardPrice)})`
        + ` Year ${userYearlyRewards.toFixed(fixedDecimals)} ($${formatMoney(userYearlyRewards*rewardPrice)})`);
  }
  return {
    userStakedUsd,
    totalStakedUsd : staked_tvl,
    userStakedPct,
    yearlyAPR,
    userYearlyUsd : userYearlyRewards * rewardPrice
  }
}

 */

