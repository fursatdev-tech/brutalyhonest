import { IoWifiOutline } from "react-icons/io5";
import { MdOutlineHotTub } from "react-icons/md";
import { FaAirFreshener } from "react-icons/fa";
import { FaKitchenSet } from "react-icons/fa6";
import { TbHanger } from "react-icons/tb";
import { BiBlanket } from "react-icons/bi";
import { GiPillow } from "react-icons/gi";
import { TbAirConditioning } from "react-icons/tb";
import { LuFan } from "react-icons/lu";
import { TbBeach } from "react-icons/tb";
import { GiCryptEntrance } from "react-icons/gi";
import { MdOutlineBalcony } from "react-icons/md";
import { MdOutlineYard } from "react-icons/md";
import { LuParkingCircle } from "react-icons/lu";
import { LuCigarette } from "react-icons/lu";
import { BiSolidWasher } from "react-icons/bi";
import { RiAlarmWarningFill } from "react-icons/ri";
import { IoThermometerOutline } from "react-icons/io5";
import { FiHelpCircle } from "react-icons/fi";
import { GiSquareBottle } from "react-icons/gi";
import { TbWashDryDip } from "react-icons/tb";
import { FiMonitor } from "react-icons/fi";
import { PiPark } from "react-icons/pi";
import { GiValley } from "react-icons/gi";
import { PiMountains } from "react-icons/pi";
import { MdCleanHands } from "react-icons/md";
import { PiBathtub } from "react-icons/pi";
import { FaSoap } from "react-icons/fa";
import { MdCurtainsClosed } from "react-icons/md";
import { TbIroning } from "react-icons/tb";
import { GiClothesline } from "react-icons/gi";
import { BiCloset } from "react-icons/bi";
import { MdOutlineSurroundSound } from "react-icons/md";
import { GiWindowBars } from "react-icons/gi";
import { PiFireExtinguisher } from "react-icons/pi";
import { TbFirstAidKit } from "react-icons/tb";
import { GiDesk } from "react-icons/gi";
import { TbToolsKitchen } from "react-icons/tb";
import { CgSmartHomeRefrigerator } from "react-icons/cg";
import { PiCookingPot } from "react-icons/pi";
import { GiGasStove } from "react-icons/gi";
import { GiToaster } from "react-icons/gi";
import { GiBarbecue } from "react-icons/gi";
import { FiCoffee } from "react-icons/fi";
import { GiTabletopPlayers } from "react-icons/gi";
import { SiOpenaccess } from "react-icons/si";
import { IoMdBonfire } from "react-icons/io";
import { BiCctv } from "react-icons/bi";
import { MdOutlineBrunchDining } from "react-icons/md";
import { GiRockingChair } from "react-icons/gi";
import { PiPersonSimpleBike } from "react-icons/pi";
import { MdOutlinePets } from "react-icons/md";
import { TbHomeCheck } from "react-icons/tb";
import { BsLuggage } from "react-icons/bs";
import { RiDoorLockBoxLine } from "react-icons/ri";
import { BsHouseUp } from "react-icons/bs";
import { WiSnowflakeCold } from "react-icons/wi";
import { BiSolidDryer } from "react-icons/bi";
import { PiSwimmingPool } from "react-icons/pi";
import { MdOutlineBreakfastDining } from "react-icons/md";

export const getAmenityIcon = (amenity: string) => {
  amenity = amenity.trim().replace(/"/g, "").toLowerCase();

  switch (amenity) {
    case "wifi":
      return IoWifiOutline;

    case "shampoo":
      return GiSquareBottle;

    case "hot water":
      return MdOutlineHotTub;

    case "shower gel":
      return FaAirFreshener;

    case "essentials":
    case "Kitchen":
    case "dishes and silverware":
      return FaKitchenSet;

    case "hangers":
      return TbHanger;

    case "bed linens":
      return BiBlanket;

    case "extra pillows and blankets":
      return GiPillow;

    case "40 hdtv with netflix, premium cable, standard cable":
    case "tv":
      return FiMonitor;

    case "air conditioning":
      return TbAirConditioning;

    case "ceiling fan":
      return LuFan;

    case "beach access – beachfront":
      return TbBeach;

    case "private entrance":
      return GiCryptEntrance;

    case "patio or balcony":
    case "private patio or balcony":
      return MdOutlineBalcony;

    case "backyard":
      return MdOutlineYard;

    case "free parking on premises":
    case "paid parking lot off premises":
    case "free street parking":
      return LuParkingCircle;

    case "smoking allowed":
      return LuCigarette;

    case "washer":
    case "paid washer – in building":
      return BiSolidWasher;

    case "hair dryer":
      return TbWashDryDip;

    case "smoke alarm":
    case "carbon monoxide alarm":
      return RiAlarmWarningFill;

    case "heating":
      return IoThermometerOutline;

    case "garden view":
      return PiPark;

    case "valley view":
      return GiValley;

    case "mountain view":
      return PiMountains;

    case "cleaning products":
      return MdCleanHands;

    case "bathtub":
      return PiBathtub;

    case "body soap":
      return FaSoap;

    case "room-darkening shades":
      return MdCurtainsClosed;

    case "iron":
      return TbIroning;

    case "drying rack for clothing":
      return GiClothesline;

    case "clothing storage: closet":
      return BiCloset;

    case "bluetooth sound system":
      return MdOutlineSurroundSound;

    case "window guards":
      return GiWindowBars;

    case "fire extinguisher":
      return PiFireExtinguisher;

    case "first aid kit":
      return TbFirstAidKit;

    case "dedicated workspace":
      return GiDesk;

    case "kitchen":
      return TbToolsKitchen;

    case "refrigerator":
      return CgSmartHomeRefrigerator;

    case "cooking basics":
      return PiCookingPot;

    case "freezer":
      return WiSnowflakeCold;

    case "stove":
      return GiGasStove;

    case "toaster":
      return GiToaster;

    case "barbecue utensils":
    case "bbq grill":
      return GiBarbecue;

    case "coffee":
      return FiCoffee;

    case "dining table":
      return GiTabletopPlayers;

    case "free resort access":
      return SiOpenaccess;

    case "fire pit":
      return IoMdBonfire;

    case "security cameras on property":
      return BiCctv;

    case "outdoor dining area":
      return MdOutlineBrunchDining;

    case "outdoor furniture":
      return GiRockingChair;

    case "bikes":
      return PiPersonSimpleBike;

    case "pets allowed":
      return MdOutlinePets;

    case "self check-in":
      return TbHomeCheck;

    case "luggage dropoff allowed":
      return BsLuggage;

    case "lockbox":
      return RiDoorLockBoxLine;

    case "long term stays allowed":
      return BsHouseUp;

    case "dryer":
      return BiSolidDryer;

    case "pool":
      return PiSwimmingPool;

    case "breakfast":
      return MdOutlineBreakfastDining;

    default:
      return FiHelpCircle;
  }
};
