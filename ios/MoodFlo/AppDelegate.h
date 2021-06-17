#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <UserNotifications/UNUserNotificationCenter.h>

// @interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>
@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate>

@property(nonatomic, strong) UIWindow *window;

- (double) getCurrentLight; // called from the RCTMoodDataModule

@end
