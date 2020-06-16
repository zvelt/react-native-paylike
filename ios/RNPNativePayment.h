@import PassKit;
@import UIKit;

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RNPNativePayment : RCTEventEmitter<RCTBridgeModule, PKPaymentAuthorizationViewControllerDelegate>

@property (nonatomic, strong) PKPaymentAuthorizationViewController *_Nullable viewController;
@property (nonatomic, copy) void (^_Nullable completion)(PKPaymentAuthorizationStatus);

- (NSArray<PKPaymentSummaryItem *> *_Nonnull) getSummaryItems:(NSDictionary *_Nonnull)paymentRequest;

@end
