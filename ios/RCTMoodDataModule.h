//
//  RCTMoodDataModule.h
//  MoodFlo
//
//  Created by Nirav on 15/06/21.
//

//#ifndef RCTMoodDataModule_h
//#define RCTMoodDataModule_h


//#endif /* RCTMoodDataModule_h */
#import <React/RCTBridgeModule.h>

@interface RCTMoodDataModule : NSObject <RCTBridgeModule>

- (void) getLightDataIOS: (RCTResponseSenderBlock)callback;

@end
