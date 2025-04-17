import { TbBeach, TbMountain, TbPool } from "react-icons/tb";
import {
  GiBarn,
  GiBoatFishing,
  GiCactus,
  GiCastle,
  GiCaveEntrance,
  GiForestCamp,
  GiIsland,
  GiWindmill,
} from "react-icons/gi";
import { FaSkiing } from "react-icons/fa";
import { BsSnow } from "react-icons/bs";
import { IoDiamond } from "react-icons/io5";
import { MdOutlineVilla } from "react-icons/md";
import { TbCategory } from "react-icons/tb";
import { FaHouseFloodWater } from "react-icons/fa6";
import { PiMountains } from "react-icons/pi";
import { TbHomeEco } from "react-icons/tb";

export const getCategoryIcon = (icon: string) => {
  switch (icon) {
    case "TbBeach":
      return TbBeach;

    case "TbMountain":
      return TbMountain;

    case "TbPool":
      return TbPool;

    case "GiBarn":
      return GiBarn;

    case "GiBoatFishing":
      return GiBoatFishing;

    case "GiCactus":
      return GiCactus;

    case "GiCastle":
      return GiCastle;

    case "GiCaveEntrance":
      return GiCaveEntrance;

    case "GiForestCamp":
      return GiForestCamp;

    case "GiIsland":
      return GiIsland;

    case "GiWindmill":
      return GiWindmill;

    case "FaSkiing":
      return FaSkiing;

    case "BsSnow":
      return BsSnow;

    case "IoDiamond":
      return IoDiamond;

    case "MdOutlineVilla":
      return MdOutlineVilla;

    case "FaHouseFloodWater":
      return FaHouseFloodWater;

    case "PiMountains":
      return PiMountains;

    case "TbHomeEco":
      return TbHomeEco;

    default:
      return TbCategory;
  }
};
