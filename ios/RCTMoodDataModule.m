//
//  RCTMoodDataModule.m
//  MoodFlo
//
//  Created by Nirav on 17/06/21.
//

#import <Foundation/Foundation.h>
#import "AppDelegate.h"
#import "RCTMoodDataModule.h"
#import <React/RCTBridge.h>

@implementation RCTMoodDataModule

RCT_EXPORT_MODULE(MoodDataModule);

RCT_EXPORT_METHOD(getLightDataIOS: (RCTResponseSenderBlock)callback) {
  dispatch_async(dispatch_get_main_queue(), ^{
    AppDelegate *appDelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
    double lightValue = [appDelegate getCurrentLight];
    callback(@[@(lightValue)]);
  });
}

@end
