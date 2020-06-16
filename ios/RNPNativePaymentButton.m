//
//  RNPNativePaymentButton.m
//  RNPaylike
//
//  Created by Bogdan Ardelean on 03/06/2020.
//  Copyright © 2020 Facebook. All rights reserved.
//
//   source: naoufal/react-native-payments

#import <Foundation/Foundation.h>
#import "RNPNativePaymentButton.h"

NSString * const DEFAULT_BUTTON_TYPE = @"plain";
NSString * const DEFAULT_BUTTON_STYLE = @"black";

@implementation RNPNativePaymentButton

@synthesize buttonStyle = _buttonStyle;
@synthesize buttonType = _buttonType;
@synthesize button = _button;

- (instancetype) init {
  self = [super init];
  
  [self setButtonType:DEFAULT_BUTTON_TYPE andStyle:DEFAULT_BUTTON_STYLE];
  
  return self;
}

- (void)setButtonType:(NSString *) value
{
    if (![_buttonType isEqualToString:value]) {
        [self setButtonType:value andStyle:self.buttonStyle];
    }
  
    _buttonType = value;
}

- (void)setButtonStyle:(NSString *) value
{
    if (![_buttonStyle isEqualToString:value]){
        [self setButtonType:_buttonType andStyle:value];
    }
  
    _buttonStyle = value;
}

/**
 * PKPayment button cannot be modified. Due to this limitation, we have to
 * unmount existint button and create new one whenever it's style and/or
 * type is changed.
 */

/*
 PKPaymentButtonTypePlain = 0,
 PKPaymentButtonTypeBuy,
 PKPaymentButtonTypeSetUp API_AVAILABLE(ios(9.0), watchos(3.0)),
 PKPaymentButtonTypeInStore API_AVAILABLE(ios(10.0), watchos(3.0)),
 PKPaymentButtonTypeDonate  API_AVAILABLE(ios(10.2), watchos(3.2)),
 PKPaymentButtonTypeCheckout  API_AVAILABLE(ios(12.0), watchos(5.0)),
 PKPaymentButtonTypeBook  API_AVAILABLE(ios(12.0), watchos(5.0)),
 PKPaymentButtonTypeSubscribe  API_AVAILABLE(ios(12.0), watchos(5.0))
 */
- (void)setButtonType:(NSString *) buttonType andStyle:(NSString *) buttonStyle
{
      for (UIView *view in self.subviews) {
        [view removeFromSuperview];
      }

      PKPaymentButtonType type;
      PKPaymentButtonStyle style;
  
      if ([buttonType isEqualToString: @"buy"]) {
        type = PKPaymentButtonTypeBuy;
      } else if ([buttonType isEqualToString: @"setUp"]) {
        type = PKPaymentButtonTypeSetUp;
      } else if ([buttonType isEqualToString: @"inStore"]) {
        type = PKPaymentButtonTypeInStore;
      } else if ([buttonType isEqualToString: @"donate"]) {
        type = PKPaymentButtonTypeDonate;
      } else if ([buttonType isEqualToString:@"checkout"]){
        type = PKPaymentButtonTypeCheckout;
      } else if ([buttonType isEqualToString:@"book"]){
        type = PKPaymentButtonTypeBook;
      } else {
        type = PKPaymentButtonTypePlain;
      }

      if ([buttonStyle isEqualToString: @"white"]) {
        style = PKPaymentButtonStyleWhite;
      } else if ([buttonStyle isEqualToString: @"whiteOutline"]) {
        style = PKPaymentButtonStyleWhiteOutline;
      } else {
        style = PKPaymentButtonStyleBlack;
      }

      _button = [[PKPaymentButton alloc] initWithPaymentButtonType:type paymentButtonStyle:style];
      [_button addTarget:self action:@selector(touchUpInside:) forControlEvents:UIControlEventTouchUpInside];
      
      [self addSubview:_button];
}

/**
 * Respond to touch event
 */
- (void)touchUpInside:(PKPaymentButton *)button
{
      if (self.onPress) {
        self.onPress(nil);
      }
}

/**
 * Set button frame to what React sets for parent view.
 */
- (void)layoutSubviews
{
    [super layoutSubviews];
    
    if (@available(iOS 12, *)) {
        [_button setCornerRadius:[self borderRadius]];
    }
    
    [_button setFrame:self.bounds];
}

@end
