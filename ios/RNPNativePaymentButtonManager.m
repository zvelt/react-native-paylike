
#import "RNPNativePaymentButtonManager.h"
#import "RNPNativePaymentButton.h"

@implementation RNPNativePaymentButtonManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)

RCT_CUSTOM_VIEW_PROPERTY(buttonType, NSString, RNPNativePaymentButton)
{
  if (json) {
    [view setButtonType:[RCTConvert NSString:json]];
  }
}

RCT_CUSTOM_VIEW_PROPERTY(buttonStyle, NSString, RNPNativePaymentButton)
{
  if (json) {
    [view setButtonStyle:[RCTConvert NSString:json]];
  }
}

- (UIView *) view
{
  return [RNPNativePaymentButton new];
}

@end
