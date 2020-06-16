#import "RNPNativePayment.h"
#import <React/RCTUtils.h>


@implementation RNPNativePayment

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[
        @"paymentAuthorized",
        @"paymentDismissed",
        @"paymentError",
    ];
}

- (NSDictionary *)constantsToExport
{
    return @{
        @"canMakePayments": @([PKPaymentAuthorizationViewController canMakePayments]),
     };
}

RCT_EXPORT_METHOD(canMakePaymentsWithNetworks:(NSArray<NSString*> *)networks
                  andCallback:(RCTResponseSenderBlock)callback)
{
    BOOL cmp = [PKPaymentAuthorizationViewController canMakePaymentsUsingNetworks:networks];
    NSString *s = cmp ? @"yes" : @"no";
    
    callback(@[[NSNull null], @{@"canMakePayments":s}]);
}

RCT_EXPORT_METHOD(show:(NSDictionary *)paymentRequest
                  withOptions:(NSDictionary *)options)
{
    if (self.viewController != nil) {
        [self abort];
    }
    
    NSString *merchantId = options[@"merchantId"];
    NSString *countryCode = options[@"countryCode"];
    NSArray *supportedNetworks = options[@"supportedNetworks"];
    
    PKPaymentRequest *pkPaymentRequest = [[PKPaymentRequest alloc] init];
    [pkPaymentRequest setMerchantIdentifier:merchantId];
    [pkPaymentRequest setMerchantCapabilities:PKMerchantCapability3DS];
    [pkPaymentRequest setCountryCode:countryCode];
    [pkPaymentRequest setCurrencyCode:paymentRequest[@"currency"]];
    [pkPaymentRequest setSupportedNetworks:supportedNetworks];
    [pkPaymentRequest setPaymentSummaryItems:[self getSummaryItems:paymentRequest]];
    
    PKPaymentAuthorizationViewController *viewController = [[PKPaymentAuthorizationViewController alloc] initWithPaymentRequest:pkPaymentRequest];
    if (!viewController) {
        [self sendEventWithName:@"paymentError" body:nil];
        return;
    }
    [viewController setDelegate:self];
    [self setViewController:viewController];
    
    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *rootViewController = RCTPresentedViewController();
        [rootViewController presentViewController:self.viewController animated:YES completion:nil];
    });
}

RCT_EXPORT_METHOD(doneWithResult:(NSString*) result)
{
    if ([result isEqualToString:@"success"] && self.completion != nil) {
        self.completion(PKPaymentAuthorizationStatusSuccess);
    } else {
        self.completion(PKPaymentAuthorizationStatusFailure);
    }
}

RCT_EXPORT_METHOD(abort)
{
    if (self.viewController != nil) {
        [self paymentAuthorizationViewControllerDidFinish:self.viewController];
    }
}

- (void)paymentAuthorizationViewController:(PKPaymentAuthorizationViewController *)controller
                       didAuthorizePayment:(PKPayment *)payment
                                completion:(void (^)(PKPaymentAuthorizationStatus))completion
{
    self.completion = completion;
    
    NSString *paymentData = [[NSString alloc] initWithData:payment.token.paymentData encoding:NSUTF8StringEncoding];
    [self sendEventWithName:@"paymentAuthorized" body:@{@"paymentData": paymentData}];
}

- (void)paymentAuthorizationViewControllerDidFinish:(nonnull PKPaymentAuthorizationViewController *)controller
{
    [controller dismissViewControllerAnimated:YES completion:nil];
    self.viewController = nil;
    self.completion = nil;
    [self sendEventWithName:@"paymentDismissed" body:nil];
}

- (NSArray<PKPaymentSummaryItem *> *_Nonnull)getSummaryItems:(NSDictionary *)paymentRequest
{
    NSMutableArray<PKPaymentSummaryItem *> *paymentSummaryItems = [NSMutableArray array];
    
    NSArray *displayItems = paymentRequest[@"displayItems"];
    if (displayItems.count) {
        for (NSDictionary *displayItem in displayItems) {
            NSDecimalNumber *amount = [NSDecimalNumber decimalNumberWithString:displayItem[@"amount"]];
            
            PKPaymentSummaryItem *item = [PKPaymentSummaryItem summaryItemWithLabel:displayItem[@"label"] amount:amount];
            [paymentSummaryItems addObject:item];
        }
    }
    
    NSDecimalNumber *totalAmount = [NSDecimalNumber decimalNumberWithString:paymentRequest[@"amount"]];
    NSString *totalLabel = paymentRequest[@"descriptor"] == nil ? @"" : paymentRequest[@"descriptor"];
    PKPaymentSummaryItem *totalItem = [PKPaymentSummaryItem summaryItemWithLabel:totalLabel amount:totalAmount];
    [paymentSummaryItems addObject:totalItem];
    
    return paymentSummaryItems;
}

@end
