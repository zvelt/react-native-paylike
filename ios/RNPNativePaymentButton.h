//
//  RNPNativePaymentButton.h
//  RNPaylike
//
//  Created by Bogdan Ardelean on 03/06/2020.
//  Copyright © 2020 Facebook. All rights reserved.
//

// source: naoufal/react-native-payments

#ifndef RNPNativePaymentButton_h
#define RNPNativePaymentButton_h

@import PassKit;
@import UIKit;

#import <React/RCTView.h>

@interface RNPNativePaymentButton : RCTView

@property (strong, nonatomic) NSString *buttonStyle;
@property (strong, nonatomic) NSString *buttonType;
@property (nonatomic, readonly) PKPaymentButton *button;
@property (nonatomic, copy) RCTBubblingEventBlock onPress;

@end

#endif /* RNPNativePaymentButton_h */
