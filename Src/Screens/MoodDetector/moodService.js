import { Dimensions } from 'react-native';
import { hapticsConfigs, hapticsTopFlags } from '../../Constants/constants';
import {
  horizontalScale,
  iPhoneXPadding,
  isIphoneX,
  verticalScale,
} from '../../Constants/sizeChoose';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

export const regularWheelSize = 74;
export const mediumWheelSize = regularWheelSize * 2.5;
export const largeWheelSize = regularWheelSize * 3.5;
let scrollerWheelSize = regularWheelSize;
export const longPressPopupDuration = 0.2;
export const mediumPressDuration = 0.8;
export const longPressDuration = 1;
let isLeftHapticsEnabled = false;
let isRightHapticsEnabled = false;
let jawsThemeCount = 0;
let circusThemeCount = 0;

export const setScrollerWheelSize = (size) => {
  scrollerWheelSize = size;
};

export const getScrollerWheelSize = () => scrollerWheelSize;

export const setIsHapticsEnabledFlag = ({ isEnabled, directionFlag }) => {
  // console.log('setIsHapticsEnabledFlag =>', isEnabled, directionFlag);
  if (directionFlag === hapticsTopFlags.both) {
    jawsThemeCount = 0;
    circusThemeCount = 0;
    isLeftHapticsEnabled = false;
    isRightHapticsEnabled = false;
  } else if (directionFlag === hapticsTopFlags.left) {
    isLeftHapticsEnabled = isEnabled;
    !isEnabled && (jawsThemeCount = 0);
  } else if (directionFlag === hapticsTopFlags.right) {
    isRightHapticsEnabled = isEnabled;
    !isEnabled && (circusThemeCount = 0);
  }
};

export const getIsHapticsEnabled = (isLeft) =>
  isLeft ? isLeftHapticsEnabled : isRightHapticsEnabled;

export const regularWheelSizeArray = [
  regularWheelSize * 0.25,
  regularWheelSize * 0.5,
  regularWheelSize * 0.75,
  regularWheelSize,
];

export const mediumWheelSizeArray = [
  mediumWheelSize * 0.2,
  mediumWheelSize * 0.45,
  mediumWheelSize * 0.7,
  mediumWheelSize,
];

export const largeWheelSizeArray = [
  largeWheelSize * 0.15,
  largeWheelSize * 0.35,
  largeWheelSize * 0.65,
  largeWheelSize,
];
// height - 132
// width - 93.75

export const initialEmotionTextData = {
  //i am using
  top: null,
  left: null,
  name: 'Slide finger',
  color: '#bfcfdc',
  img: '',
};

let emotionsTextData = {
  "1": {
    "app_priority": 6,
    "color": null,
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/16377558401050556517619e2bc079bad.svg",
    "id": "79fba97b-2eb8-47d5-8d44-9b15ceaa1e6c",
    "left": [
      0,
      52
    ],
    "name": "Annoyed",
    "parent_id": "71c07325-3311-483f-b048-605d834d0661",
    "position": "1,2,3,13,14,15,27",
    "position_at": "1",
    "top": [
      112,
      162
    ]
  },
  "2": {
    "app_priority": 6,
    "color": null,
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/16377558401050556517619e2bc079bad.svg",
    "id": "79fba97b-2eb8-47d5-8d44-9b15ceaa1e6c",
    "left": [
      0,
      52
    ],
    "name": "Annoyed",
    "parent_id": "71c07325-3311-483f-b048-605d834d0661",
    "position": "1,2,3,13,14,15,27",
    "position_at": "2",
    "top": [
      162,
      212
    ]
  },
  "3": {
    "app_priority": 6,
    "color": null,
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/16377558401050556517619e2bc079bad.svg",
    "id": "79fba97b-2eb8-47d5-8d44-9b15ceaa1e6c",
    "left": [
      0,
      52
    ],
    "name": "Annoyed",
    "parent_id": "71c07325-3311-483f-b048-605d834d0661",
    "position": "1,2,3,13,14,15,27",
    "position_at": "3",
    "top": [
      212,
      262
    ]
  },
  "4": {
    "app_priority": 5,
    "color": null,
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/16377553911277391846619e29ff979f9.svg",
    "id": "594e5408-8e0f-4613-b843-fb81d2322eb8",
    "left": [
      0,
      52
    ],
    "name": "Frustrated",
    "parent_id": "a2fb79e8-e203-46a5-8d76-a6efcefe26f2",
    "position": "4,16,28,29,40",
    "position_at": "4",
    "top": [
      262,
      312
    ]
  },
  "5": {
    "app_priority": 1,
    "color": "#ED6662",
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/1637756082994929706619e2cb226d46.svg",
    "id": "a2fb79e8-e203-46a5-8d76-a6efcefe26f2",
    "left": [
      0,
      52
    ],
    "name": "Upset",
    "parent_id": null,
    "position": "5,6,17,18",
    "position_at": "5",
    "top": [
      312,
      362
    ]
  },
  "6": {
    "app_priority": 1,
    "color": "#ED6662",
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/1637756082994929706619e2cb226d46.svg",
    "id": "a2fb79e8-e203-46a5-8d76-a6efcefe26f2",
    "left": [
      0,
      52
    ],
    "name": "Upset",
    "parent_id": null,
    "position": "5,6,17,18",
    "position_at": "6",
    "top": [
      362,
      412
    ]
  },
  "7": {
    "app_priority": 3,
    "color": "#9A9EA3",
    "confirmation_text": "Hang in there, Flx would like to know if you're ok later",
    "icon": "mood_icons/1637755034942999699619e289a19259.svg",
    "id": "e08c39dc-579a-4e8e-a342-967931151ca9",
    "left": [
      0,
      52
    ],
    "name": "Sad",
    "parent_id": null,
    "position": "7,8,9,19,31",
    "position_at": "7",
    "top": [
      412,
      462
    ]
  },
  "8": {
    "app_priority": 3,
    "color": "#9A9EA3",
    "confirmation_text": "Hang in there, Flx would like to know if you're ok later",
    "icon": "mood_icons/1637755034942999699619e289a19259.svg",
    "id": "e08c39dc-579a-4e8e-a342-967931151ca9",
    "left": [
      0,
      52
    ],
    "name": "Sad",
    "parent_id": null,
    "position": "7,8,9,19,31",
    "position_at": "8",
    "top": [
      462,
      512
    ]
  },
  "9": {
    "app_priority": 3,
    "color": "#9A9EA3",
    "confirmation_text": "Hang in there, Flx would like to know if you're ok later",
    "icon": "mood_icons/1637755034942999699619e289a19259.svg",
    "id": "e08c39dc-579a-4e8e-a342-967931151ca9",
    "left": [
      0,
      52
    ],
    "name": "Sad",
    "parent_id": null,
    "position": "7,8,9,19,31",
    "position_at": "9",
    "top": [
      512,
      562
    ]
  },
  "10": {
    "app_priority": 4,
    "color": "#4C5F79",
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/16377560461999035212619e2c8e4022a.svg",
    "id": "da6e32d2-f8f0-439d-8540-ed85d543c2aa",
    "left": [
      0,
      52
    ],
    "name": "Bored",
    "parent_id": null,
    "position": "10,11,12,22,23,24,34,35",
    "position_at": "10",
    "top": [
      562,
      612
    ]
  },
  "11": {
    "app_priority": 4,
    "color": "#4C5F79",
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/16377560461999035212619e2c8e4022a.svg",
    "id": "da6e32d2-f8f0-439d-8540-ed85d543c2aa",
    "left": [
      0,
      52
    ],
    "name": "Bored",
    "parent_id": null,
    "position": "10,11,12,22,23,24,34,35",
    "position_at": "11",
    "top": [
      612,
      662
    ]
  },
  "12": {
    "app_priority": 4,
    "color": "#4C5F79",
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/16377560461999035212619e2c8e4022a.svg",
    "id": "da6e32d2-f8f0-439d-8540-ed85d543c2aa",
    "left": [
      0,
      52
    ],
    "name": "Bored",
    "parent_id": null,
    "position": "10,11,12,22,23,24,34,35",
    "position_at": "12",
    "top": [
      662,
      713
    ]
  },
  "13": {
    "app_priority": 6,
    "color": null,
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/16377558401050556517619e2bc079bad.svg",
    "id": "79fba97b-2eb8-47d5-8d44-9b15ceaa1e6c",
    "left": [
      52,
      104
    ],
    "name": "Annoyed",
    "parent_id": "71c07325-3311-483f-b048-605d834d0661",
    "position": "1,2,3,13,14,15,27",
    "position_at": "13",
    "top": [
      112,
      162
    ]
  },
  "14": {
    "app_priority": 6,
    "color": null,
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/16377558401050556517619e2bc079bad.svg",
    "id": "79fba97b-2eb8-47d5-8d44-9b15ceaa1e6c",
    "left": [
      52,
      104
    ],
    "name": "Annoyed",
    "parent_id": "71c07325-3311-483f-b048-605d834d0661",
    "position": "1,2,3,13,14,15,27",
    "position_at": "14",
    "top": [
      162,
      212
    ]
  },
  "15": {
    "app_priority": 6,
    "color": null,
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/16377558401050556517619e2bc079bad.svg",
    "id": "79fba97b-2eb8-47d5-8d44-9b15ceaa1e6c",
    "left": [
      52,
      104
    ],
    "name": "Annoyed",
    "parent_id": "71c07325-3311-483f-b048-605d834d0661",
    "position": "1,2,3,13,14,15,27",
    "position_at": "15",
    "top": [
      212,
      262
    ]
  },
  "16": {
    "app_priority": 5,
    "color": null,
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/16377553911277391846619e29ff979f9.svg",
    "id": "594e5408-8e0f-4613-b843-fb81d2322eb8",
    "left": [
      52,
      104
    ],
    "name": "Frustrated",
    "parent_id": "a2fb79e8-e203-46a5-8d76-a6efcefe26f2",
    "position": "4,16,28,29,40",
    "position_at": "16",
    "top": [
      262,
      312
    ]
  },
  "17": {
    "app_priority": 1,
    "color": "#ED6662",
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/1637756082994929706619e2cb226d46.svg",
    "id": "a2fb79e8-e203-46a5-8d76-a6efcefe26f2",
    "left": [
      52,
      104
    ],
    "name": "Upset",
    "parent_id": null,
    "position": "5,6,17,18",
    "position_at": "17",
    "top": [
      312,
      362
    ]
  },
  "18": {
    "app_priority": 1,
    "color": "#ED6662",
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/1637756082994929706619e2cb226d46.svg",
    "id": "a2fb79e8-e203-46a5-8d76-a6efcefe26f2",
    "left": [
      52,
      104
    ],
    "name": "Upset",
    "parent_id": null,
    "position": "5,6,17,18",
    "position_at": "18",
    "top": [
      362,
      412
    ]
  },
  "19": {
    "app_priority": 3,
    "color": "#9A9EA3",
    "confirmation_text": "Hang in there, Flx would like to know if you're ok later",
    "icon": "mood_icons/1637755034942999699619e289a19259.svg",
    "id": "e08c39dc-579a-4e8e-a342-967931151ca9",
    "left": [
      52,
      104
    ],
    "name": "Sad",
    "parent_id": null,
    "position": "7,8,9,19,31",
    "position_at": "19",
    "top": [
      412,
      462
    ]
  },
  "20": {
    "app_priority": null,
    "color": null,
    "confirmation_text": null,
    "icon": "mood_icons/16377568741935767495619e2fca8161c.svg",
    "id": "abad9076-b41c-45fe-a3e5-960b1afe5f9f",
    "left": [
      52,
      104
    ],
    "name": "Gloomy",
    "parent_id": "e08c39dc-579a-4e8e-a342-967931151ca9",
    "position": "20,21,32,33",
    "position_at": "20",
    "top": [
      462,
      512
    ]
  },
  "21": {
    "app_priority": null,
    "color": null,
    "confirmation_text": null,
    "icon": "mood_icons/16377568741935767495619e2fca8161c.svg",
    "id": "abad9076-b41c-45fe-a3e5-960b1afe5f9f",
    "left": [
      52,
      104
    ],
    "name": "Gloomy",
    "parent_id": "e08c39dc-579a-4e8e-a342-967931151ca9",
    "position": "20,21,32,33",
    "position_at": "21",
    "top": [
      512,
      562
    ]
  },
  "22": {
    "app_priority": 4,
    "color": "#4C5F79",
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/16377560461999035212619e2c8e4022a.svg",
    "id": "da6e32d2-f8f0-439d-8540-ed85d543c2aa",
    "left": [
      52,
      104
    ],
    "name": "Bored",
    "parent_id": null,
    "position": "10,11,12,22,23,24,34,35",
    "position_at": "22",
    "top": [
      562,
      612
    ]
  },
  "23": {
    "app_priority": 4,
    "color": "#4C5F79",
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/16377560461999035212619e2c8e4022a.svg",
    "id": "da6e32d2-f8f0-439d-8540-ed85d543c2aa",
    "left": [
      52,
      104
    ],
    "name": "Bored",
    "parent_id": null,
    "position": "10,11,12,22,23,24,34,35",
    "position_at": "23",
    "top": [
      612,
      662
    ]
  },
  "24": {
    "app_priority": 4,
    "color": "#4C5F79",
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/16377560461999035212619e2c8e4022a.svg",
    "id": "da6e32d2-f8f0-439d-8540-ed85d543c2aa",
    "left": [
      52,
      104
    ],
    "name": "Bored",
    "parent_id": null,
    "position": "10,11,12,22,23,24,34,35",
    "position_at": "24",
    "top": [
      662,
      713
    ]
  },
  "25": {
    "app_priority": 2,
    "color": "#B88DCC",
    "confirmation_text": "Thanks - make sure you check in with Flx soon",
    "icon": "mood_icons/1637756019132089759619e2c73c3a5d.svg",
    "id": "71c07325-3311-483f-b048-605d834d0661",
    "left": [
      104,
      155
    ],
    "name": "Tense",
    "parent_id": null,
    "position": "25,26,37,38,39",
    "position_at": "25",
    "top": [
      112,
      162
    ]
  },
  "26": {
    "app_priority": 2,
    "color": "#B88DCC",
    "confirmation_text": "Thanks - make sure you check in with Flx soon",
    "icon": "mood_icons/1637756019132089759619e2c73c3a5d.svg",
    "id": "71c07325-3311-483f-b048-605d834d0661",
    "left": [
      104,
      155
    ],
    "name": "Tense",
    "parent_id": null,
    "position": "25,26,37,38,39",
    "position_at": "26",
    "top": [
      162,
      212
    ]
  },
  "27": {
    "app_priority": 6,
    "color": null,
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/16377558401050556517619e2bc079bad.svg",
    "id": "79fba97b-2eb8-47d5-8d44-9b15ceaa1e6c",
    "left": [
      104,
      155
    ],
    "name": "Annoyed",
    "parent_id": "71c07325-3311-483f-b048-605d834d0661",
    "position": "1,2,3,13,14,15,27",
    "position_at": "27",
    "top": [
      212,
      262
    ]
  },
  "28": {
    "app_priority": 5,
    "color": null,
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/16377553911277391846619e29ff979f9.svg",
    "id": "594e5408-8e0f-4613-b843-fb81d2322eb8",
    "left": [
      104,
      155
    ],
    "name": "Frustrated",
    "parent_id": "a2fb79e8-e203-46a5-8d76-a6efcefe26f2",
    "position": "4,16,28,29,40",
    "position_at": "28",
    "top": [
      262,
      312
    ]
  },
  "29": {
    "app_priority": 5,
    "color": null,
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/16377553911277391846619e29ff979f9.svg",
    "id": "594e5408-8e0f-4613-b843-fb81d2322eb8",
    "left": [
      104,
      155
    ],
    "name": "Frustrated",
    "parent_id": "a2fb79e8-e203-46a5-8d76-a6efcefe26f2",
    "position": "4,16,28,29,40",
    "position_at": "29",
    "top": [
      312,
      362
    ]
  },
  "30": {
    "app_priority": null,
    "color": null,
    "confirmation_text": null,
    "icon": "mood_icons/1637754817466302973619e27c16a414.svg",
    "id": "b4bd1683-8581-4156-844b-bc88c1f439f0",
    "left": [
      104,
      155
    ],
    "name": "Impatient",
    "parent_id": "a2fb79e8-e203-46a5-8d76-a6efcefe26f2",
    "position": "30,41,42",
    "position_at": "30",
    "top": [
      362,
      412
    ]
  },
  "31": {
    "app_priority": 3,
    "color": "#9A9EA3",
    "confirmation_text": "Hang in there, Flx would like to know if you're ok later",
    "icon": "mood_icons/1637755034942999699619e289a19259.svg",
    "id": "e08c39dc-579a-4e8e-a342-967931151ca9",
    "left": [
      104,
      155
    ],
    "name": "Sad",
    "parent_id": null,
    "position": "7,8,9,19,31",
    "position_at": "31",
    "top": [
      412,
      462
    ]
  },
  "32": {
    "app_priority": null,
    "color": null,
    "confirmation_text": null,
    "icon": "mood_icons/16377568741935767495619e2fca8161c.svg",
    "id": "abad9076-b41c-45fe-a3e5-960b1afe5f9f",
    "left": [
      104,
      155
    ],
    "name": "Gloomy",
    "parent_id": "e08c39dc-579a-4e8e-a342-967931151ca9",
    "position": "20,21,32,33",
    "position_at": "32",
    "top": [
      462,
      512
    ]
  },
  "33": {
    "app_priority": null,
    "color": null,
    "confirmation_text": null,
    "icon": "mood_icons/16377568741935767495619e2fca8161c.svg",
    "id": "abad9076-b41c-45fe-a3e5-960b1afe5f9f",
    "left": [
      104,
      155
    ],
    "name": "Gloomy",
    "parent_id": "e08c39dc-579a-4e8e-a342-967931151ca9",
    "position": "20,21,32,33",
    "position_at": "33",
    "top": [
      512,
      562
    ]
  },
  "34": {
    "app_priority": 4,
    "color": "#4C5F79",
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/16377560461999035212619e2c8e4022a.svg",
    "id": "da6e32d2-f8f0-439d-8540-ed85d543c2aa",
    "left": [
      104,
      155
    ],
    "name": "Bored",
    "parent_id": null,
    "position": "10,11,12,22,23,24,34,35",
    "position_at": "34",
    "top": [
      562,
      612
    ]
  },
  "35": {
    "app_priority": 4,
    "color": "#4C5F79",
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/16377560461999035212619e2c8e4022a.svg",
    "id": "da6e32d2-f8f0-439d-8540-ed85d543c2aa",
    "left": [
      104,
      155
    ],
    "name": "Bored",
    "parent_id": null,
    "position": "10,11,12,22,23,24,34,35",
    "position_at": "35",
    "top": [
      612,
      662
    ]
  },
  "36": {
    "app_priority": 8,
    "color": null,
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/1637755873485833125619e2be149794.svg",
    "id": "32043734-1bac-4b59-8e15-b6791011f52f",
    "left": [
      104,
      155
    ],
    "name": "Tired",
    "parent_id": "da6e32d2-f8f0-439d-8540-ed85d543c2aa",
    "position": "36,46,47,48",
    "position_at": "36",
    "top": [
      662,
      713
    ]
  },
  "37": {
    "app_priority": 2,
    "color": "#B88DCC",
    "confirmation_text": "Thanks - make sure you check in with Flx soon",
    "icon": "mood_icons/1637756019132089759619e2c73c3a5d.svg",
    "id": "71c07325-3311-483f-b048-605d834d0661",
    "left": [
      155,
      207
    ],
    "name": "Tense",
    "parent_id": null,
    "position": "25,26,37,38,39",
    "position_at": "37",
    "top": [
      112,
      162
    ]
  },
  "38": {
    "app_priority": 2,
    "color": "#B88DCC",
    "confirmation_text": "Thanks - make sure you check in with Flx soon",
    "icon": "mood_icons/1637756019132089759619e2c73c3a5d.svg",
    "id": "71c07325-3311-483f-b048-605d834d0661",
    "left": [
      155,
      207
    ],
    "name": "Tense",
    "parent_id": null,
    "position": "25,26,37,38,39",
    "position_at": "38",
    "top": [
      162,
      212
    ]
  },
  "39": {
    "app_priority": 2,
    "color": "#B88DCC",
    "confirmation_text": "Thanks - make sure you check in with Flx soon",
    "icon": "mood_icons/1637756019132089759619e2c73c3a5d.svg",
    "id": "71c07325-3311-483f-b048-605d834d0661",
    "left": [
      155,
      207
    ],
    "name": "Tense",
    "parent_id": null,
    "position": "25,26,37,38,39",
    "position_at": "39",
    "top": [
      212,
      262
    ]
  },
  "40": {
    "app_priority": 5,
    "color": null,
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/16377553911277391846619e29ff979f9.svg",
    "id": "594e5408-8e0f-4613-b843-fb81d2322eb8",
    "left": [
      155,
      207
    ],
    "name": "Frustrated",
    "parent_id": "a2fb79e8-e203-46a5-8d76-a6efcefe26f2",
    "position": "4,16,28,29,40",
    "position_at": "40",
    "top": [
      262,
      312
    ]
  },
  "41": {
    "app_priority": null,
    "color": null,
    "confirmation_text": null,
    "icon": "mood_icons/1637754817466302973619e27c16a414.svg",
    "id": "b4bd1683-8581-4156-844b-bc88c1f439f0",
    "left": [
      155,
      207
    ],
    "name": "Impatient",
    "parent_id": "a2fb79e8-e203-46a5-8d76-a6efcefe26f2",
    "position": "30,41,42",
    "position_at": "41",
    "top": [
      312,
      362
    ]
  },
  "42": {
    "app_priority": null,
    "color": null,
    "confirmation_text": null,
    "icon": "mood_icons/1637754817466302973619e27c16a414.svg",
    "id": "b4bd1683-8581-4156-844b-bc88c1f439f0",
    "left": [
      155,
      207
    ],
    "name": "Impatient",
    "parent_id": "a2fb79e8-e203-46a5-8d76-a6efcefe26f2",
    "position": "30,41,42",
    "position_at": "42",
    "top": [
      362,
      412
    ]
  },
  "43": {
    "app_priority": 7,
    "color": null,
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/16377559231446904824619e2c138dfe5.svg",
    "id": "2c764148-a046-409f-97c8-85220c2162de",
    "left": [
      155,
      207
    ],
    "name": "Worried",
    "parent_id": "e08c39dc-579a-4e8e-a342-967931151ca9",
    "position": "43,44,45",
    "position_at": "43",
    "top": [
      412,
      462
    ]
  },
  "44": {
    "app_priority": 7,
    "color": null,
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/16377559231446904824619e2c138dfe5.svg",
    "id": "2c764148-a046-409f-97c8-85220c2162de",
    "left": [
      155,
      207
    ],
    "name": "Worried",
    "parent_id": "e08c39dc-579a-4e8e-a342-967931151ca9",
    "position": "43,44,45",
    "position_at": "44",
    "top": [
      462,
      512
    ]
  },
  "45": {
    "app_priority": 7,
    "color": null,
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/16377559231446904824619e2c138dfe5.svg",
    "id": "2c764148-a046-409f-97c8-85220c2162de",
    "left": [
      155,
      207
    ],
    "name": "Worried",
    "parent_id": "e08c39dc-579a-4e8e-a342-967931151ca9",
    "position": "43,44,45",
    "position_at": "45",
    "top": [
      512,
      562
    ]
  },
  "46": {
    "app_priority": 8,
    "color": null,
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/1637755873485833125619e2be149794.svg",
    "id": "32043734-1bac-4b59-8e15-b6791011f52f",
    "left": [
      155,
      207
    ],
    "name": "Tired",
    "parent_id": "da6e32d2-f8f0-439d-8540-ed85d543c2aa",
    "position": "36,46,47,48",
    "position_at": "46",
    "top": [
      562,
      612
    ]
  },
  "47": {
    "app_priority": 8,
    "color": null,
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/1637755873485833125619e2be149794.svg",
    "id": "32043734-1bac-4b59-8e15-b6791011f52f",
    "left": [
      155,
      207
    ],
    "name": "Tired",
    "parent_id": "da6e32d2-f8f0-439d-8540-ed85d543c2aa",
    "position": "36,46,47,48",
    "position_at": "47",
    "top": [
      612,
      662
    ]
  },
  "48": {
    "app_priority": 8,
    "color": null,
    "confirmation_text": "Big day... tell me about it",
    "icon": "mood_icons/1637755873485833125619e2be149794.svg",
    "id": "32043734-1bac-4b59-8e15-b6791011f52f",
    "left": [
      155,
      207
    ],
    "name": "Tired",
    "parent_id": "da6e32d2-f8f0-439d-8540-ed85d543c2aa",
    "position": "36,46,47,48",
    "position_at": "48",
    "top": [
      662,
      713
    ]
  },
  "49": {
    "app_priority": 9,
    "color": null,
    "confirmation_text": "Awesome Flx, thanks!",
    "icon": "mood_icons/1637755733431173973619e2b553009c.svg",
    "id": "c3d99c75-dd32-437b-a417-5e1654328cb1",
    "left": [
      207,
      259
    ],
    "name": "Alert",
    "parent_id": "a6b543a4-07d3-4781-8f1a-80ddf7f22808",
    "position": "49,50,61,73,74,85,86",
    "position_at": "49",
    "top": [
      112,
      162
    ]
  },
  "50": {
    "app_priority": 9,
    "color": null,
    "confirmation_text": "Awesome Flx, thanks!",
    "icon": "mood_icons/1637755733431173973619e2b553009c.svg",
    "id": "c3d99c75-dd32-437b-a417-5e1654328cb1",
    "left": [
      207,
      259
    ],
    "name": "Alert",
    "parent_id": "a6b543a4-07d3-4781-8f1a-80ddf7f22808",
    "position": "49,50,61,73,74,85,86",
    "position_at": "50",
    "top": [
      162,
      212
    ]
  },
  "51": {
    "app_priority": 13,
    "color": "#5CCCDA",
    "confirmation_text": "Awesome Flx, thanks!",
    "icon": "mood_icons/1637755990895278122619e2c5681ca2.svg",
    "id": "a6b543a4-07d3-4781-8f1a-80ddf7f22808",
    "left": [
      207,
      259
    ],
    "name": "Excited",
    "parent_id": null,
    "position": "51,62,63,75,87",
    "position_at": "51",
    "top": [
      212,
      262
    ]
  },
  "52": {
    "app_priority": null,
    "color": null,
    "confirmation_text": null,
    "icon": "mood_icons/16377565822091033529619e2ea6627ad.svg",
    "id": "7ae0766e-3ac3-49b7-9ee0-ecd47ab90b09",
    "left": [
      207,
      259
    ],
    "name": "Amused",
    "parent_id": "13b3c477-9e5f-4bd3-b312-0abbb32e48bb",
    "position": "52,53,54,66",
    "position_at": "52",
    "top": [
      262,
      312
    ]
  },
  "53": {
    "app_priority": null,
    "color": null,
    "confirmation_text": null,
    "icon": "mood_icons/16377565822091033529619e2ea6627ad.svg",
    "id": "7ae0766e-3ac3-49b7-9ee0-ecd47ab90b09",
    "left": [
      207,
      259
    ],
    "name": "Amused",
    "parent_id": "13b3c477-9e5f-4bd3-b312-0abbb32e48bb",
    "position": "52,53,54,66",
    "position_at": "53",
    "top": [
      312,
      362
    ]
  },
  "54": {
    "app_priority": null,
    "color": null,
    "confirmation_text": null,
    "icon": "mood_icons/16377565822091033529619e2ea6627ad.svg",
    "id": "7ae0766e-3ac3-49b7-9ee0-ecd47ab90b09",
    "left": [
      207,
      259
    ],
    "name": "Amused",
    "parent_id": "13b3c477-9e5f-4bd3-b312-0abbb32e48bb",
    "position": "52,53,54,66",
    "position_at": "54",
    "top": [
      362,
      412
    ]
  },
  "55": {
    "app_priority": null,
    "color": null,
    "confirmation_text": null,
    "icon": "mood_icons/16377568002018794453619e2f80950a1.svg",
    "id": "04ea7c45-ccd8-4566-8344-cbcbba5ab34b",
    "left": [
      207,
      259
    ],
    "name": "Confident",
    "parent_id": "43bd3752-d44b-4309-90f8-b081172461f2",
    "position": "55,56,57,68,69",
    "position_at": "55",
    "top": [
      412,
      462
    ]
  },
  "56": {
    "app_priority": null,
    "color": null,
    "confirmation_text": null,
    "icon": "mood_icons/16377568002018794453619e2f80950a1.svg",
    "id": "04ea7c45-ccd8-4566-8344-cbcbba5ab34b",
    "left": [
      207,
      259
    ],
    "name": "Confident",
    "parent_id": "43bd3752-d44b-4309-90f8-b081172461f2",
    "position": "55,56,57,68,69",
    "position_at": "56",
    "top": [
      462,
      512
    ]
  },
  "57": {
    "app_priority": null,
    "color": null,
    "confirmation_text": null,
    "icon": "mood_icons/16377568002018794453619e2f80950a1.svg",
    "id": "04ea7c45-ccd8-4566-8344-cbcbba5ab34b",
    "left": [
      207,
      259
    ],
    "name": "Confident",
    "parent_id": "43bd3752-d44b-4309-90f8-b081172461f2",
    "position": "55,56,57,68,69",
    "position_at": "57",
    "top": [
      512,
      562
    ]
  },
  "58": {
    "app_priority": 16,
    "color": "#FFC5A5",
    "confirmation_text": "Cheers! The Flx is real",
    "icon": "mood_icons/16377557961066032845619e2b941c0c5.svg",
    "id": "56b4197c-8f6a-48bc-8751-33b16a572da7",
    "left": [
      207,
      259
    ],
    "name": "Calm",
    "parent_id": null,
    "position": "58,59,60,71,72,84,96",
    "position_at": "58",
    "top": [
      562,
      612
    ]
  },
  "59": {
    "app_priority": 16,
    "color": "#FFC5A5",
    "confirmation_text": "Cheers! The Flx is real",
    "icon": "mood_icons/16377557961066032845619e2b941c0c5.svg",
    "id": "56b4197c-8f6a-48bc-8751-33b16a572da7",
    "left": [
      207,
      259
    ],
    "name": "Calm",
    "parent_id": null,
    "position": "58,59,60,71,72,84,96",
    "position_at": "59",
    "top": [
      612,
      662
    ]
  },
  "60": {
    "app_priority": 16,
    "color": "#FFC5A5",
    "confirmation_text": "Cheers! The Flx is real",
    "icon": "mood_icons/16377557961066032845619e2b941c0c5.svg",
    "id": "56b4197c-8f6a-48bc-8751-33b16a572da7",
    "left": [
      207,
      259
    ],
    "name": "Calm",
    "parent_id": null,
    "position": "58,59,60,71,72,84,96",
    "position_at": "60",
    "top": [
      662,
      713
    ]
  },
  "61": {
    "app_priority": 9,
    "color": null,
    "confirmation_text": "Awesome Flx, thanks!",
    "icon": "mood_icons/1637755733431173973619e2b553009c.svg",
    "id": "c3d99c75-dd32-437b-a417-5e1654328cb1",
    "left": [
      259,
      311
    ],
    "name": "Alert",
    "parent_id": "a6b543a4-07d3-4781-8f1a-80ddf7f22808",
    "position": "49,50,61,73,74,85,86",
    "position_at": "61",
    "top": [
      112,
      162
    ]
  },
  "62": {
    "app_priority": 13,
    "color": "#5CCCDA",
    "confirmation_text": "Awesome Flx, thanks!",
    "icon": "mood_icons/1637755990895278122619e2c5681ca2.svg",
    "id": "a6b543a4-07d3-4781-8f1a-80ddf7f22808",
    "left": [
      259,
      311
    ],
    "name": "Excited",
    "parent_id": null,
    "position": "51,62,63,75,87",
    "position_at": "62",
    "top": [
      162,
      212
    ]
  },
  "63": {
    "app_priority": 13,
    "color": "#5CCCDA",
    "confirmation_text": "Awesome Flx, thanks!",
    "icon": "mood_icons/1637755990895278122619e2c5681ca2.svg",
    "id": "a6b543a4-07d3-4781-8f1a-80ddf7f22808",
    "left": [
      259,
      311
    ],
    "name": "Excited",
    "parent_id": null,
    "position": "51,62,63,75,87",
    "position_at": "63",
    "top": [
      212,
      262
    ]
  },
  "64": {
    "app_priority": 10,
    "color": null,
    "confirmation_text": "Awesome Flx, thanks!",
    "icon": "mood_icons/1637755767150699794619e2b77d8901.svg",
    "id": "c52921a3-fc8f-4e8c-9a77-d9ba17a773dd",
    "left": [
      259,
      311
    ],
    "name": "Delighted",
    "parent_id": "13b3c477-9e5f-4bd3-b312-0abbb32e48bb",
    "position": "64,65,76,77",
    "position_at": "64",
    "top": [
      262,
      312
    ]
  },
  "65": {
    "app_priority": 10,
    "color": null,
    "confirmation_text": "Awesome Flx, thanks!",
    "icon": "mood_icons/1637755767150699794619e2b77d8901.svg",
    "id": "c52921a3-fc8f-4e8c-9a77-d9ba17a773dd",
    "left": [
      259,
      311
    ],
    "name": "Delighted",
    "parent_id": "13b3c477-9e5f-4bd3-b312-0abbb32e48bb",
    "position": "64,65,76,77",
    "position_at": "65",
    "top": [
      312,
      362
    ]
  },
  "66": {
    "app_priority": null,
    "color": null,
    "confirmation_text": null,
    "icon": "mood_icons/16377565822091033529619e2ea6627ad.svg",
    "id": "7ae0766e-3ac3-49b7-9ee0-ecd47ab90b09",
    "left": [
      259,
      311
    ],
    "name": "Amused",
    "parent_id": "13b3c477-9e5f-4bd3-b312-0abbb32e48bb",
    "position": "52,53,54,66",
    "position_at": "66",
    "top": [
      362,
      412
    ]
  },
  "67": {
    "app_priority": 11,
    "color": null,
    "confirmation_text": "Nice, go with your Flx!",
    "icon": "mood_icons/1637755224886653763619e2958b5009.svg",
    "id": "23bd0192-8d1a-435f-a6b7-8c5fa97c5487",
    "left": [
      259,
      311
    ],
    "name": "Glad",
    "parent_id": "43bd3752-d44b-4309-90f8-b081172461f2",
    "position": "67,79,80,91",
    "position_at": "67",
    "top": [
      412,
      462
    ]
  },
  "68": {
    "app_priority": null,
    "color": null,
    "confirmation_text": null,
    "icon": "mood_icons/16377568002018794453619e2f80950a1.svg",
    "id": "04ea7c45-ccd8-4566-8344-cbcbba5ab34b",
    "left": [
      259,
      311
    ],
    "name": "Confident",
    "parent_id": "43bd3752-d44b-4309-90f8-b081172461f2",
    "position": "55,56,57,68,69",
    "position_at": "68",
    "top": [
      462,
      512
    ]
  },
  "69": {
    "app_priority": null,
    "color": null,
    "confirmation_text": null,
    "icon": "mood_icons/16377568002018794453619e2f80950a1.svg",
    "id": "04ea7c45-ccd8-4566-8344-cbcbba5ab34b",
    "left": [
      259,
      311
    ],
    "name": "Confident",
    "parent_id": "43bd3752-d44b-4309-90f8-b081172461f2",
    "position": "55,56,57,68,69",
    "position_at": "69",
    "top": [
      512,
      562
    ]
  },
  "70": {
    "app_priority": 12,
    "color": null,
    "confirmation_text": "Nice, go with your Flx!",
    "icon": "mood_icons/1637755625460446087619e2ae9c64a5.svg",
    "id": "88028988-a2d5-4ee3-8912-a4ffac7e9c43",
    "left": [
      259,
      311
    ],
    "name": "Relaxed",
    "parent_id": "56b4197c-8f6a-48bc-8751-33b16a572da7",
    "position": "70,82,83,94,95",
    "position_at": "70",
    "top": [
      562,
      612
    ]
  },
  "71": {
    "app_priority": 16,
    "color": "#FFC5A5",
    "confirmation_text": "Cheers! The Flx is real",
    "icon": "mood_icons/16377557961066032845619e2b941c0c5.svg",
    "id": "56b4197c-8f6a-48bc-8751-33b16a572da7",
    "left": [
      259,
      311
    ],
    "name": "Calm",
    "parent_id": null,
    "position": "58,59,60,71,72,84,96",
    "position_at": "71",
    "top": [
      612,
      662
    ]
  },
  "72": {
    "app_priority": 16,
    "color": "#FFC5A5",
    "confirmation_text": "Cheers! The Flx is real",
    "icon": "mood_icons/16377557961066032845619e2b941c0c5.svg",
    "id": "56b4197c-8f6a-48bc-8751-33b16a572da7",
    "left": [
      259,
      311
    ],
    "name": "Calm",
    "parent_id": null,
    "position": "58,59,60,71,72,84,96",
    "position_at": "72",
    "top": [
      662,
      713
    ]
  },
  "73": {
    "app_priority": 9,
    "color": null,
    "confirmation_text": "Awesome Flx, thanks!",
    "icon": "mood_icons/1637755733431173973619e2b553009c.svg",
    "id": "c3d99c75-dd32-437b-a417-5e1654328cb1",
    "left": [
      311,
      362
    ],
    "name": "Alert",
    "parent_id": "a6b543a4-07d3-4781-8f1a-80ddf7f22808",
    "position": "49,50,61,73,74,85,86",
    "position_at": "73",
    "top": [
      112,
      162
    ]
  },
  "74": {
    "app_priority": 9,
    "color": null,
    "confirmation_text": "Awesome Flx, thanks!",
    "icon": "mood_icons/1637755733431173973619e2b553009c.svg",
    "id": "c3d99c75-dd32-437b-a417-5e1654328cb1",
    "left": [
      311,
      362
    ],
    "name": "Alert",
    "parent_id": "a6b543a4-07d3-4781-8f1a-80ddf7f22808",
    "position": "49,50,61,73,74,85,86",
    "position_at": "74",
    "top": [
      162,
      212
    ]
  },
  "75": {
    "app_priority": 13,
    "color": "#5CCCDA",
    "confirmation_text": "Awesome Flx, thanks!",
    "icon": "mood_icons/1637755990895278122619e2c5681ca2.svg",
    "id": "a6b543a4-07d3-4781-8f1a-80ddf7f22808",
    "left": [
      311,
      362
    ],
    "name": "Excited",
    "parent_id": null,
    "position": "51,62,63,75,87",
    "position_at": "75",
    "top": [
      212,
      262
    ]
  },
  "76": {
    "app_priority": 10,
    "color": null,
    "confirmation_text": "Awesome Flx, thanks!",
    "icon": "mood_icons/1637755767150699794619e2b77d8901.svg",
    "id": "c52921a3-fc8f-4e8c-9a77-d9ba17a773dd",
    "left": [
      311,
      362
    ],
    "name": "Delighted",
    "parent_id": "13b3c477-9e5f-4bd3-b312-0abbb32e48bb",
    "position": "64,65,76,77",
    "position_at": "76",
    "top": [
      262,
      312
    ]
  },
  "77": {
    "app_priority": 10,
    "color": null,
    "confirmation_text": "Awesome Flx, thanks!",
    "icon": "mood_icons/1637755767150699794619e2b77d8901.svg",
    "id": "c52921a3-fc8f-4e8c-9a77-d9ba17a773dd",
    "left": [
      311,
      362
    ],
    "name": "Delighted",
    "parent_id": "13b3c477-9e5f-4bd3-b312-0abbb32e48bb",
    "position": "64,65,76,77",
    "position_at": "77",
    "top": [
      312,
      362
    ]
  },
  "78": {
    "app_priority": 14,
    "color": "#648DE7",
    "confirmation_text": "Yes! Get your Flx on",
    "icon": "mood_icons/16377561101618845728619e2cce2a3e3.svg",
    "id": "13b3c477-9e5f-4bd3-b312-0abbb32e48bb",
    "left": [
      311,
      362
    ],
    "name": "Happy",
    "parent_id": null,
    "position": "78,88,89,90",
    "position_at": "78",
    "top": [
      362,
      412
    ]
  },
  "79": {
    "app_priority": 11,
    "color": null,
    "confirmation_text": "Nice, go with your Flx!",
    "icon": "mood_icons/1637755224886653763619e2958b5009.svg",
    "id": "23bd0192-8d1a-435f-a6b7-8c5fa97c5487",
    "left": [
      311,
      362
    ],
    "name": "Glad",
    "parent_id": "43bd3752-d44b-4309-90f8-b081172461f2",
    "position": "67,79,80,91",
    "position_at": "79",
    "top": [
      412,
      462
    ]
  },
  "80": {
    "app_priority": 11,
    "color": null,
    "confirmation_text": "Nice, go with your Flx!",
    "icon": "mood_icons/1637755224886653763619e2958b5009.svg",
    "id": "23bd0192-8d1a-435f-a6b7-8c5fa97c5487",
    "left": [
      311,
      362
    ],
    "name": "Glad",
    "parent_id": "43bd3752-d44b-4309-90f8-b081172461f2",
    "position": "67,79,80,91",
    "position_at": "80",
    "top": [
      462,
      512
    ]
  },
  "81": {
    "app_priority": 15,
    "color": "#F2AF57",
    "confirmation_text": "Nice, go with your Flx!",
    "icon": "mood_icons/1637755959552191379619e2c3743b5b.svg",
    "id": "43bd3752-d44b-4309-90f8-b081172461f2",
    "left": [
      311,
      362
    ],
    "name": "Content",
    "parent_id": null,
    "position": "81,92,93",
    "position_at": "81",
    "top": [
      512,
      562
    ]
  },
  "82": {
    "app_priority": 12,
    "color": null,
    "confirmation_text": "Nice, go with your Flx!",
    "icon": "mood_icons/1637755625460446087619e2ae9c64a5.svg",
    "id": "88028988-a2d5-4ee3-8912-a4ffac7e9c43",
    "left": [
      311,
      362
    ],
    "name": "Relaxed",
    "parent_id": "56b4197c-8f6a-48bc-8751-33b16a572da7",
    "position": "70,82,83,94,95",
    "position_at": "82",
    "top": [
      562,
      612
    ]
  },
  "83": {
    "app_priority": 12,
    "color": null,
    "confirmation_text": "Nice, go with your Flx!",
    "icon": "mood_icons/1637755625460446087619e2ae9c64a5.svg",
    "id": "88028988-a2d5-4ee3-8912-a4ffac7e9c43",
    "left": [
      311,
      362
    ],
    "name": "Relaxed",
    "parent_id": "56b4197c-8f6a-48bc-8751-33b16a572da7",
    "position": "70,82,83,94,95",
    "position_at": "83",
    "top": [
      612,
      662
    ]
  },
  "84": {
    "app_priority": 16,
    "color": "#FFC5A5",
    "confirmation_text": "Cheers! The Flx is real",
    "icon": "mood_icons/16377557961066032845619e2b941c0c5.svg",
    "id": "56b4197c-8f6a-48bc-8751-33b16a572da7",
    "left": [
      311,
      362
    ],
    "name": "Calm",
    "parent_id": null,
    "position": "58,59,60,71,72,84,96",
    "position_at": "84",
    "top": [
      662,
      713
    ]
  },
  "85": {
    "app_priority": 9,
    "color": null,
    "confirmation_text": "Awesome Flx, thanks!",
    "icon": "mood_icons/1637755733431173973619e2b553009c.svg",
    "id": "c3d99c75-dd32-437b-a417-5e1654328cb1",
    "left": [
      362,
      414
    ],
    "name": "Alert",
    "parent_id": "a6b543a4-07d3-4781-8f1a-80ddf7f22808",
    "position": "49,50,61,73,74,85,86",
    "position_at": "85",
    "top": [
      112,
      162
    ]
  },
  "86": {
    "app_priority": 9,
    "color": null,
    "confirmation_text": "Awesome Flx, thanks!",
    "icon": "mood_icons/1637755733431173973619e2b553009c.svg",
    "id": "c3d99c75-dd32-437b-a417-5e1654328cb1",
    "left": [
      362,
      414
    ],
    "name": "Alert",
    "parent_id": "a6b543a4-07d3-4781-8f1a-80ddf7f22808",
    "position": "49,50,61,73,74,85,86",
    "position_at": "86",
    "top": [
      162,
      212
    ]
  },
  "87": {
    "app_priority": 13,
    "color": "#5CCCDA",
    "confirmation_text": "Awesome Flx, thanks!",
    "icon": "mood_icons/1637755990895278122619e2c5681ca2.svg",
    "id": "a6b543a4-07d3-4781-8f1a-80ddf7f22808",
    "left": [
      362,
      414
    ],
    "name": "Excited",
    "parent_id": null,
    "position": "51,62,63,75,87",
    "position_at": "87",
    "top": [
      212,
      262
    ]
  },
  "88": {
    "app_priority": 14,
    "color": "#648DE7",
    "confirmation_text": "Yes! Get your Flx on",
    "icon": "mood_icons/16377561101618845728619e2cce2a3e3.svg",
    "id": "13b3c477-9e5f-4bd3-b312-0abbb32e48bb",
    "left": [
      362,
      414
    ],
    "name": "Happy",
    "parent_id": null,
    "position": "78,88,89,90",
    "position_at": "88",
    "top": [
      262,
      312
    ]
  },
  "89": {
    "app_priority": 14,
    "color": "#648DE7",
    "confirmation_text": "Yes! Get your Flx on",
    "icon": "mood_icons/16377561101618845728619e2cce2a3e3.svg",
    "id": "13b3c477-9e5f-4bd3-b312-0abbb32e48bb",
    "left": [
      362,
      414
    ],
    "name": "Happy",
    "parent_id": null,
    "position": "78,88,89,90",
    "position_at": "89",
    "top": [
      312,
      362
    ]
  },
  "90": {
    "app_priority": 14,
    "color": "#648DE7",
    "confirmation_text": "Yes! Get your Flx on",
    "icon": "mood_icons/16377561101618845728619e2cce2a3e3.svg",
    "id": "13b3c477-9e5f-4bd3-b312-0abbb32e48bb",
    "left": [
      362,
      414
    ],
    "name": "Happy",
    "parent_id": null,
    "position": "78,88,89,90",
    "position_at": "90",
    "top": [
      362,
      412
    ]
  },
  "91": {
    "app_priority": 11,
    "color": null,
    "confirmation_text": "Nice, go with your Flx!",
    "icon": "mood_icons/1637755224886653763619e2958b5009.svg",
    "id": "23bd0192-8d1a-435f-a6b7-8c5fa97c5487",
    "left": [
      362,
      414
    ],
    "name": "Glad",
    "parent_id": "43bd3752-d44b-4309-90f8-b081172461f2",
    "position": "67,79,80,91",
    "position_at": "91",
    "top": [
      412,
      462
    ]
  },
  "92": {
    "app_priority": 15,
    "color": "#F2AF57",
    "confirmation_text": "Nice, go with your Flx!",
    "icon": "mood_icons/1637755959552191379619e2c3743b5b.svg",
    "id": "43bd3752-d44b-4309-90f8-b081172461f2",
    "left": [
      362,
      414
    ],
    "name": "Content",
    "parent_id": null,
    "position": "81,92,93",
    "position_at": "92",
    "top": [
      462,
      512
    ]
  },
  "93": {
    "app_priority": 15,
    "color": "#F2AF57",
    "confirmation_text": "Nice, go with your Flx!",
    "icon": "mood_icons/1637755959552191379619e2c3743b5b.svg",
    "id": "43bd3752-d44b-4309-90f8-b081172461f2",
    "left": [
      362,
      414
    ],
    "name": "Content",
    "parent_id": null,
    "position": "81,92,93",
    "position_at": "93",
    "top": [
      512,
      562
    ]
  },
  "94": {
    "app_priority": 12,
    "color": null,
    "confirmation_text": "Nice, go with your Flx!",
    "icon": "mood_icons/1637755625460446087619e2ae9c64a5.svg",
    "id": "88028988-a2d5-4ee3-8912-a4ffac7e9c43",
    "left": [
      362,
      414
    ],
    "name": "Relaxed",
    "parent_id": "56b4197c-8f6a-48bc-8751-33b16a572da7",
    "position": "70,82,83,94,95",
    "position_at": "94",
    "top": [
      562,
      612
    ]
  },
  "95": {
    "app_priority": 12,
    "color": null,
    "confirmation_text": "Nice, go with your Flx!",
    "icon": "mood_icons/1637755625460446087619e2ae9c64a5.svg",
    "id": "88028988-a2d5-4ee3-8912-a4ffac7e9c43",
    "left": [
      362,
      414
    ],
    "name": "Relaxed",
    "parent_id": "56b4197c-8f6a-48bc-8751-33b16a572da7",
    "position": "70,82,83,94,95",
    "position_at": "95",
    "top": [
      612,
      662
    ]
  },
  "96": {
    "app_priority": 16,
    "color": "#FFC5A5",
    "confirmation_text": "Cheers! The Flx is real",
    "icon": "mood_icons/16377557961066032845619e2b941c0c5.svg",
    "id": "56b4197c-8f6a-48bc-8751-33b16a572da7",
    "left": [
      362,
      414
    ],
    "name": "Calm",
    "parent_id": null,
    "position": "58,59,60,71,72,84,96",
    "position_at": "96",
    "top": [
      662,
      713
    ]
  }
};

export const setEmotionsTextData = (top, left, height, width, allMoods) => {
  // console.log('setEmotionTextData called --------------------------', top);
  // console.log('top: ', top, ' left: ', left, ' height: ', height, ' width: ', width, ' screenHeight: ', screenHeight, ' screenWidth: ', screenWidth);
  if (
    top === undefined ||
    left === undefined ||
    height === undefined ||
    width === undefined ||
    !Array.isArray(allMoods) ||
    allMoods.length < 16
  ) {
    // console.log(
    //   'setEmotionsTextData ===> false',
    //   ' top ---: ',
    //   top,
    //   ' left====: ',
    //   left,
    //   ' height=====: ',
    //   height,
    //   ' width====: ',
    //   width,
    //   'allMoods ===>',
    //   'allMoods',
    // );
    return;
  }
  let data = {};
  let flag = true;
  if (allMoods.length === 16) {
    const blockWidth = width / 4;
    const blockHeight = height / 4;
    // console.log('top: ', top, ' left: ', left, ' height: ', height, ' width: ', width, ' blockWidth: ', blockWidth, 'blockHeight: ', blockHeight, ' screenHeight: ', screenHeight, ' screenWidth: ', screenWidth);
    const [h1, h2, h3, h4, h5] = [
      top,
      top + blockHeight,
      top + blockHeight * 2,
      top + blockHeight * 3,
      top + height,
    ];
    const [w1, w2, w3, w4, w5] = [
      left,
      left + blockWidth,
      left + blockWidth * 2,
      left + blockWidth * 3,
      left + width,
    ];
    const getTopForIndex = (idx) => {
      if (idx === 0 || idx === 4 || idx === 8 || idx === 12) {
        return [h1, h2];
      } else if (idx === 1 || idx === 5 || idx === 9 || idx === 13) {
        return [h2, h3];
      } else if (idx === 2 || idx === 6 || idx === 10 || idx === 14) {
        return [h3, h4];
      } else if (idx === 3 || idx === 7 || idx === 11 || idx === 15) {
        return [h4, h5];
      }
    };
    const getLeftForIndex = (idx) => {
      if (idx === 0 || idx === 1 || idx === 2 || idx === 3) {
        return [w1, w2];
      } else if (idx === 4 || idx === 5 || idx === 6 || idx === 7) {
        return [w2, w3];
      } else if (idx === 8 || idx === 9 || idx === 10 || idx === 11) {
        return [w3, w4];
      } else if (idx === 12 || idx === 13 || idx === 14 || idx === 15) {
        return [w4, w5];
      }
    };
    allMoods.forEach((e, idx) => {
      if (typeof e?.name !== 'string') {
        flag = false;
      } else {
        data[e.name] = e;
      }
    });
    if (flag === true) {
      emotionsTextData = null;
      emotionsTextData = {...data};
    }
    Object.keys(emotionsTextData).forEach((e, idx) => {
      let [y1, y2] = getTopForIndex(idx);
      let [x1, x2] = getLeftForIndex(idx);
      emotionsTextData[e].top = [Math.round(y1), Math.round(y2)];
      emotionsTextData[e].left = [Math.round(x1), Math.round(x2)];
    });
  } else if (allMoods.length === 96) {
    const blockWidth = width / 8;
    const blockHeight = height / 12;
    // console.log('top: ', top, ' left: ', left, ' height: ', height, ' width: ', width, ' blockWidth: ', blockWidth, 'blockHeight: ', blockHeight, ' screenHeight: ', screenHeight, ' screenWidth: ', screenWidth);
    const [h1, h2, h3, h4, h5, h6, h7, h8, h9, h10, h11, h12, h13] = [
      top,
      top + blockHeight,
      top + blockHeight * 2,
      top + blockHeight * 3,
      top + blockHeight * 4,
      top + blockHeight * 5,
      top + blockHeight * 6,
      top + blockHeight * 7,
      top + blockHeight * 8,
      top + blockHeight * 9,
      top + blockHeight * 10,
      top + blockHeight * 11,
      top + height,
    ];
    const [w1, w2, w3, w4, w5, w6, w7, w8, w9] = [
      left,
      left + blockWidth,
      left + blockWidth * 2,
      left + blockWidth * 3,
      left + blockWidth * 4,
      left + blockWidth * 5,
      left + blockWidth * 6,
      left + blockWidth * 7,
      left + width,
    ];
    const getTopForIndex = (idx) => {
      if (idx === 0 || idx === 12 || idx === 24 || idx === 36 || idx === 48 || idx === 60 || idx === 72 || idx === 84) {
        return [h1, h2];
      } else if (idx === 1 || idx === 13 || idx === 25 || idx === 37 || idx === 49 || idx === 61 || idx === 73 || idx === 85) {
        return [h2, h3];
      } else if (idx === 2 || idx === 14 || idx === 26 || idx === 38 || idx === 50 || idx === 62 || idx === 74 || idx === 86) {
        return [h3, h4];
      } else if (idx === 3 || idx === 15 || idx === 27 || idx === 39 || idx === 51 || idx === 63 || idx === 75 || idx === 87) {
        return [h4, h5];
      } else if (idx === 4 || idx === 16 || idx === 28 || idx === 40 || idx === 52 || idx === 64 || idx === 76 || idx === 88) {
        return [h5, h6];
      } else if (idx === 5 || idx === 17 || idx === 29 || idx === 41 || idx === 53 || idx === 65 || idx === 77 || idx === 89) {
        return [h6, h7];
      } else if (idx === 6 || idx === 18 || idx === 30 || idx === 42 || idx === 54 || idx === 66 || idx === 78 || idx === 90) {
        return [h7, h8];
      } else if (idx === 7 || idx === 19 || idx === 31 || idx === 43 || idx === 55 || idx === 67 || idx === 79 || idx === 91) {
        return [h8, h9];
      } else if (idx === 8 || idx === 20 || idx === 32 || idx === 44 || idx === 56 || idx === 68 || idx === 80 || idx === 92) {
        return [h9, h10];
      } else if (idx === 9 || idx === 21 || idx === 33 || idx === 45 || idx === 57 || idx === 69 || idx === 81 || idx === 93) {
        return [h10, h11];
      } else if (idx === 10 || idx === 22 || idx === 34 || idx === 46 || idx === 58 || idx === 70 || idx === 82 || idx === 94) {
        return [h11, h12];
      } else if (idx === 11 || idx === 23 || idx === 35 || idx === 47 || idx === 59 || idx === 71 || idx === 83 || idx === 95) {
        return [h12, h13];
      }
    };
    const getLeftForIndex = (idx) => {
      if (idx === 0 || idx === 1 || idx === 2 || idx === 3 || idx === 4 || idx === 5 || idx === 6 || idx === 7 || idx === 8 || idx === 9 || idx === 10 || idx === 11) {
        return [w1, w2];
      } else if (idx === 12 || idx === 13 || idx === 14 || idx === 15 || idx === 16 || idx === 17 || idx === 18 || idx === 19 || idx === 20 || idx === 21 || idx === 22 || idx === 23) {
        return [w2, w3];
      } else if (idx === 24 || idx === 25 || idx === 26 || idx === 27 || idx === 28 || idx === 29 || idx === 30 || idx === 31 || idx === 32 || idx === 33 || idx === 34 || idx === 35) {
        return [w3, w4];
      } else if (idx === 36 || idx === 37 || idx === 38 || idx === 39 || idx === 40 || idx === 41 || idx === 42 || idx === 43 || idx === 44 || idx === 45 || idx === 46 || idx === 47) {
        return [w4, w5];
      } else if (idx === 48 || idx === 49 || idx === 50 || idx === 51 || idx === 52 || idx === 53 || idx === 54 || idx === 55 || idx === 56 || idx === 57 || idx === 58 || idx === 59) {
        return [w5, w6];
      } else if (idx === 60 || idx === 61 || idx === 62 || idx === 63 || idx === 64 || idx === 65 || idx === 66 || idx === 67 || idx === 68 || idx === 69 || idx === 70 || idx === 71) {
        return [w6, w7];
      } else if (idx === 72 || idx === 73 || idx === 74 || idx === 75 || idx === 76 || idx === 77 || idx === 78 || idx === 79 || idx === 80 || idx === 81 || idx === 82 || idx === 83) {
        return [w7, w8];
      } else if (idx === 84 || idx === 85 || idx === 86 || idx === 87 || idx === 88 || idx === 89 || idx === 90 || idx === 91 || idx === 92 || idx === 93 || idx === 94 || idx === 95) {
        return [w8, w9];
      }
    };
    allMoods.forEach((e, idx) => {
      if (typeof e?.name !== 'string') {
        flag = false;
      } else {
        data[e.position_at] = e;
      }
    });
    if (flag === true) {
      emotionsTextData = null;
      emotionsTextData = {...data};
    }
    Object.keys(emotionsTextData).forEach((e, idx) => {
      let [y1, y2] = getTopForIndex(idx);
      let [x1, x2] = getLeftForIndex(idx);
      emotionsTextData[e].top = [Math.round(y1), Math.round(y2)];
      emotionsTextData[e].left = [Math.round(x1), Math.round(x2)];
    });
  }
  // let data = {};
  // let flag = true;
  // allMoods.forEach((e, idx) => {
  //   if (typeof e?.name !== 'string') {
  //     flag = false;
  //   } else {
  //     data[e.name] = e;
  //   }
  // });
  // if (flag === true) {
  //   emotionsTextData = null;
  //   emotionsTextData = {...data};
  // }
  // Object.keys(emotionsTextData).forEach((e, idx) => {
  //   let [y1, y2] = getTopForIndex(idx);
  //   let [x1, x2] = getLeftForIndex(idx);
  //   emotionsTextData[e].top = [Math.round(y1), Math.round(y2)];
  //   emotionsTextData[e].left = [Math.round(x1), Math.round(x2)];
  // });
  // console.log('emotionTextData', emotionsTextData);
};

export const getEmotionsTextData = (y, x, emotionData = null, userData) => {
  let top = Math.round(y);
  let left = Math.round(x);
  // console.log('top: ', top, 'left: ', left,)
  let d = null;

  if (Array.isArray(userData?.AllMoods) && userData.AllMoods.length > 0) {
    let checkField = userData.AllMoods?.[0]?.position_at !== undefined ? 'position_at' : 'name'
    for (let i = 0; i < userData.AllMoods.length && d === null; i++) {
      if (
        typeof userData?.AllMoods?.[i]?.[checkField] !== undefined &&
        top > emotionsTextData[userData.AllMoods[i][checkField]]?.top?.[0] &&
        top < emotionsTextData[userData.AllMoods[i][checkField]]?.top?.[1] &&
        left > emotionsTextData[userData.AllMoods[i][checkField]]?.left?.[0] &&
        left < emotionsTextData[userData.AllMoods[i][checkField]]?.left?.[1]
      ) {
        d = emotionsTextData?.[userData.AllMoods[i][checkField]]
          ? {...emotionsTextData[userData.AllMoods[i][checkField]]}
          : emotionData;
      }
    }
  }
  if (d !== null) {
    return d;
  } else {
    return emotionData;
  }
  if (
    typeof userData?.AllMoods?.[0]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[0].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[0].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[0].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[0].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[0].name]};
  }
  if (
    typeof userData?.AllMoods?.[1]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[1].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[1].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[1].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[1].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[1].name]};
  }
  if (
    typeof userData?.AllMoods?.[2]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[2].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[2].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[2].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[2].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[2].name]};
  }
  if (
    typeof userData?.AllMoods?.[3]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[3].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[3].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[3].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[3].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[3].name]};
  }
  if (
    typeof userData?.AllMoods?.[4]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[4].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[4].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[4].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[4].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[4].name]};
  }
  if (
    typeof userData?.AllMoods?.[5]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[5].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[5].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[5].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[5].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[5].name]};
  }
  if (
    typeof userData?.AllMoods?.[6]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[6].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[6].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[6].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[6].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[6].name]};
  }
  if (
    typeof userData?.AllMoods?.[7]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[7].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[7].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[7].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[7].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[7].name]};
  }
  if (
    typeof userData?.AllMoods?.[8]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[8].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[8].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[8].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[8].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[8].name]};
  }
  if (
    typeof userData?.AllMoods?.[9]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[9].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[9].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[9].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[9].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[9].name]};
  }
  if (
    typeof userData?.AllMoods?.[10]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[10].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[10].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[10].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[10].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[10].name]};
  }
  if (
    typeof userData?.AllMoods?.[11]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[11].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[11].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[11].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[11].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[11].name]};
  }
  if (
    typeof userData?.AllMoods?.[12]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[12].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[12].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[12].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[12].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[12].name]};
  }
  if (
    typeof userData?.AllMoods?.[13]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[13].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[13].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[13].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[13].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[13].name]};
  }
  if (
    typeof userData?.AllMoods?.[14]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[14].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[14].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[14].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[14].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[14].name]};
  }
  if (
    typeof userData?.AllMoods?.[15]?.name === 'string' &&
    top > emotionsTextData[userData.AllMoods[15].name]?.top?.[0] &&
    top < emotionsTextData[userData.AllMoods[15].name]?.top?.[1] &&
    left > emotionsTextData[userData.AllMoods[15].name]?.left?.[0] &&
    left < emotionsTextData[userData.AllMoods[15].name]?.left?.[1]
  ) {
    return {...emotionsTextData[userData.AllMoods[15].name]};
  }
  //rattled
  return emotionData;
};

const isIphoneXFlag = isIphoneX;
const getLandscapePaddingHorizontal = () => {
  return isIphoneXFlag
    ? iPhoneXPadding.landscape.paddingLeft +
    iPhoneXPadding.landscape.paddingRight
    : 0;
};
const getPortraitPaddingHorizontal = () => {
  return isIphoneXFlag
    ? iPhoneXPadding.portrait.paddingLeft + iPhoneXPadding.portrait.paddingRight
    : 0;
};
const getLandscapePaddingVertical = () => {
  return isIphoneXFlag
    ? iPhoneXPadding.landscape.paddingBottom +
    iPhoneXPadding.landscape.paddingTop
    : 0;
};

const getPortraitPaddingVertical = () => {
  return isIphoneXFlag
    ? iPhoneXPadding.portrait.paddingBottom + iPhoneXPadding.portrait.paddingTop
    : 0;
};

const getLandscapePaddingTop = () => {
  return isIphoneXFlag ? iPhoneXPadding.landscape.paddingTop : 0;
};

const getPortraitPaddingTop = () => {
  return isIphoneXFlag ? iPhoneXPadding.portrait.paddingTop : 0;
};

export const getScrollerOffset = (
  screenSize = window,
  scrollerWheelSize,
  scrollerContainerSize,
  toolTipSize,
  blocksSize,
  screenContainerSize,
) => {
  const isLandscape = screenSize.width > screenSize.height;
  const extraVerticalPadding = Platform.OS === 'android' ? verticalScale(0) : 0;
  const paddingHorizontal = isLandscape
    ? getLandscapePaddingHorizontal()
    : getPortraitPaddingHorizontal();
  const paddingVertical = isLandscape
    ? getLandscapePaddingVertical()
    : getPortraitPaddingVertical();
  const paddingTop = isLandscape
    ? getLandscapePaddingTop()
    : getPortraitPaddingTop();
  // const paddingTop = isIphoneXFlag ? (isLandscape ? iPhoneXPadding.landscape.paddingTop : iPhoneXPadding.portrait.paddingTop) : 0;
  // const paddingTop = isIphoneXFlag ? (isLandscape ? iPhoneXPadding.landscape.paddingTop : screenContainerSize.top) : 0;
  // const paddingBottom = isIphoneXFlag ? (isLandscape ? iPhoneXPadding.landscape.paddingBottom : iPhoneXPadding.portrait.paddingBottom) : 0;
  // console.log('offset paddingTop', paddingTop, isIphoneXFlag);
  // scrollerContainerSize.height = 117.1;
  // scrollerContainerSize.width = 104.7;
  // console.log('getScrollerOffset => screenSize: ', screenSize, ' scrollerWheelSize: ', scrollerWheelSize, ' scrollerContainerSize: ', scrollerContainerSize, ' toolTipSize: ', toolTipSize, ' blocksSize: ', blocksSize);
  // console.log('getScrollerOffset paddingTop', paddingTop)
  // console.log('getScrollerOffset paddingVertical', paddingVertical)
  // const toolTipHeight = toolTipSize.height - 10;
  const toolTipHeight = 0;
  const scrollerHeight = toolTipHeight + scrollerWheelSize;
  // const scrollerWidth =
  //   toolTipSize.width > scrollerWheelSize
  //     ? toolTipSize.width
  //     : scrollerWheelSize;
  const scrollerWidth = scrollerWheelSize;
  const bubbleCenterOffsetTop = toolTipHeight + scrollerWheelSize / 2;
  // console.log('getScrollerOffset scrollerHeight', scrollerHeight)
  const yMin = blocksSize?.top - extraVerticalPadding - bubbleCenterOffsetTop;
  const yMax = yMin + (blocksSize?.height ?? 0);
  const xMin = 0 - scrollerWidth / 2;
  const xMax = screenSize.width - scrollerWidth / 2 - paddingHorizontal;
  const initialX = (blocksSize.width - blocksSize.left) / 2 - scrollerWidth / 2;
  const initialY = yMin + blocksSize.height / 2;
  return {
    xMin,
    xMax,
    yMin,
    yMax,
    initialX,
    initialY,
    scrollerWidth,
    toolTipHeight,
    scrollerHeight,
    bubbleCenterOffsetTop,
  };
};

export const getHapticStats = (y, x, blocksSize, offsetSize) => {
  let hapticType = '';
  let timeInterval = -1;
  let percentage = 0;
  let isLeft = false;
  if (y < blocksSize.top) {
    return { hapticType, timeInterval, percentage, isLeft };
  } else if (y > blocksSize.top + blocksSize.height) {
    return { hapticType, timeInterval, percentage, isLeft };
  }
  const yPosInBlock = y - blocksSize.top;
  const blockSizeHalf = blocksSize.height / 2;
  percentage = 100 - Math.round((yPosInBlock / blockSizeHalf) * 100);
  let interval = (100 - Math.abs(percentage)) / 1000;
  let fifteenPercent = (interval * 1000 * 15) / 100;
  if (percentage > 0 && percentage <= 27) {
    hapticType = hapticsConfigs.car.light;
    timeInterval = (0.2 * 1000 + interval * 1000) / 1000;
  } else if (percentage > 27 && percentage <= 54) {
    hapticType = hapticsConfigs.car.medium;
    timeInterval = (0.2 * 1000 + interval * 1000) / 1000;
  } else if (percentage > 54 && percentage <= 100) {
    // hapticType = hapticsConfigs.car.high;
    hapticType = hapticsConfigs.car.medium;
    timeInterval = (0.01 * 1000 + interval * 1000) / 1000;
    // timeInterval = ((interval * 1000) + fifteenPercent) / 1000;
  } else if (percentage < 0 && percentage >= -27) {
    hapticType = hapticsConfigs.heartBeat.light;
    timeInterval = (0.7 * 1000 + interval * 1000) / 1000;
  } else if (percentage < -27 && percentage >= -54) {
    hapticType = hapticsConfigs.heartBeat.light;
    timeInterval = (0.6 * 1000 + interval * 1000) / 1000;
  } else if (percentage < -54 && percentage >= -100) {
    hapticType = hapticsConfigs.heartBeat.light;
    timeInterval = (0.5 * 1000 + interval * 1000) / 1000;
  }
  // console.log('getHapticStats percentage', percentage);
  // console.log('getHapticStats hapticType', hapticType);
  // console.log('getHapticStats timeInterval', timeInterval);
  if (x < screenWidth / 2) {
    isLeft = true;
  }
  return { hapticType, timeInterval, percentage, isLeft };
};

export const playHapticJawsTheme = (callback) => {
  setIsHapticsEnabledFlag({
    isEnabled: false,
    directionFlag: hapticsTopFlags.right,
  });
  if (!getIsHapticsEnabled(true)) {
    return;
  }
  const hapticOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: true,
  };

  let timeoutId = null;
  let c = 0;
  function playHaptics(count) {
    if (!getIsHapticsEnabled(true)) {
      return;
    }
    if (c === 0) {
      ReactNativeHapticFeedback.trigger(hapticsConfigs.car.high, hapticOptions);
      c++;
    }
    if (c <= count) {
      let playHapticsTimeoutId = setTimeout(() => {
        if (getIsHapticsEnabled(true)) {
          ReactNativeHapticFeedback.trigger(
            hapticsConfigs.car.high,
            hapticOptions,
          );
        }
        clearTimeout(playHapticsTimeoutId);
        playHapticsTimeoutId = null;
        c++;
        playHaptics(count);
      }, 700);
    }
  }

  if (jawsThemeCount <= 3) {
    timeoutId = setTimeout(() => {
      if (getIsHapticsEnabled(true)) {
        c = 0;
        playHaptics(8);
        jawsThemeCount++;
      }
      clearTimeout(timeoutId);
      timeoutId = null;
      callback?.();
    }, (jawsThemeCount === 0 ? 0 : 1) * 1000);
  } else {
    timeoutId = setTimeout(() => {
      if (getIsHapticsEnabled(true)) {
        c = 0;
        playHaptics(3);
        jawsThemeCount++;
      }
      clearTimeout(timeoutId);
      timeoutId = null;
      callback?.();
    }, (jawsThemeCount === 4 ? 1.2 : 0.5) * 1000);
  }
};

export const playHapticCircusTheme = (callback) => {
  setIsHapticsEnabledFlag({
    isEnabled: false,
    directionFlag: hapticsTopFlags.left,
  });
  if (!getIsHapticsEnabled(false)) {
    return;
  }
  const hapticOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: true,
  };

  let timeoutId = null;
  let c = 0;
  function playHaptics(count) {
    // for (let i = 0; i <= count; i++) {
    //   ReactNativeHapticFeedback.trigger(hapticsConfigs.car.high, hapticOptions);
    // }
    if (!getIsHapticsEnabled(false)) {
      return;
    }
    if (c === 0) {
      ReactNativeHapticFeedback.trigger(hapticsConfigs.car.high, hapticOptions);
      c++;
    }
    if (c <= count) {
      let playHapticsTimeoutId = setTimeout(() => {
        if (getIsHapticsEnabled(false)) {
          ReactNativeHapticFeedback.trigger(
            hapticsConfigs.car.high,
            hapticOptions,
          );
        }
        clearTimeout(playHapticsTimeoutId);
        playHapticsTimeoutId = null;
        c++;
        playHaptics(count);
      }, 700);
    }
  }

  if (circusThemeCount <= 1 || circusThemeCount >= 3) {
    timeoutId = setTimeout(() => {
      if (getIsHapticsEnabled(false)) {
        c = 0;
        playHaptics(1);
        if (circusThemeCount === 6) {
          circusThemeCount = -1;
        } else if (circusThemeCount === -1) {
          circusThemeCount = 1;
        } else {
          circusThemeCount++;
        }
      }
      clearTimeout(timeoutId);
      timeoutId = null;
      callback?.();
    }, (circusThemeCount === 0 ? 0 : circusThemeCount === -1 ? 0.6 : circusThemeCount === 3 ? 0.7 : 0.5) * 1000);
  } else {
    timeoutId = setTimeout(() => {
      if (getIsHapticsEnabled(false)) {
        c = 0;
        playHaptics(5);
        circusThemeCount++;
      }
      clearTimeout(timeoutId);
      timeoutId = null;
      callback?.();
    }, 0.5 * 1000);
  }

  // timeoutId = setTimeout(() => {
  //   if (getIsHapticsEnabled(false)) {
  //     playHaptics(2);
  //     circusThemeCount++;
  //     circusThemeCount === 6 && (circusThemeCount = 1);
  //   }
  //   clearTimeout(timeoutId);
  //   timeoutId = null;
  //   callback?.();
  // }, (circusThemeCount === 0 ? 0 : (circusThemeCount >= 4 && circusThemeCount <= 7) ? 0.2 : 0.6) * 1000);
};
