import VersionCheck from "react-native-version-check";
import { logger } from "../..";

export const checkAppVersion = async () => {
  try {
    const latestVersion = await VersionCheck.getLatestVersion();
    const currentVersion = await VersionCheck.getCurrentVersion();
    logger("latestVersion",latestVersion)
    logger("currentVersion",currentVersion)
    if (latestVersion > currentVersion) {
      return true
    } else {
      return false
    }
  } catch (error) {
    logger("Error checking app version:", error);
    return false
  }
};
