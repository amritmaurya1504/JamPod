import { avatarSeeds, colorArr } from "../constants";
import { IState } from "../types";

export const getAvatar = ():string => {
    const randomInd = Math.floor(Math.random() * avatarSeeds.length);
    const seed = avatarSeeds[randomInd];
    const avatarUrl = `https://api.dicebear.com/7.x/open-peeps/svg?seed=${seed}`;
    return avatarUrl;
    
}

export const removeDuplicatesById = (arr: IState[] | ((prev: IState[]) => IState[])): IState[] => {
    const uniqueIds = new Set<string>();
    const uniqueClients: IState[] = [];
  
    typeof arr === "object" && arr.forEach((client) => {
      if (!uniqueIds.has(client._id)) {
        uniqueIds.add(client._id);
        uniqueClients.push(client);
      }
    });
  
    return uniqueClients;
  };

export const getBorderColor = ():string => {
  const randomIndx = Math.floor(Math.random() * colorArr.length);
  return `#${colorArr[randomIndx]}`;
}