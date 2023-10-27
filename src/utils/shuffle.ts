export const shuffle = (arr: any) => {
  const res = arr.sort(() => Math.random() - 0.5);
  return [...res];
};
import {getShuffle} from '../Api/getShuffle';

const handleShuffle = async (id: String, media_type: String) => {
  const res = await getShuffle(id, media_type);
  const ans = res.data.results;
  let rndEle = ans[Math.floor(Math.random() * ans.length)];
  while(!rndEle){
    rndEle = ans[Math.floor(Math.random() * ans.length)]
  }
  while (!rndEle?.poster_path) {
    rndEle = ans[Math.floor(Math.random() * ans.length)];
  }
  return rndEle.poster_path;
};

export {handleShuffle};
