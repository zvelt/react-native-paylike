package io.paylike;

import android.view.View;

import androidx.annotation.NonNull;

import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

@ReactModule(name = RNPNativePaymentButtonManager.REACT_CLASS)
public class RNPNativePaymentButtonManager extends SimpleViewManager<View> {
    protected static final String REACT_CLASS = "RNPNativePaymentButton";

    @NonNull
    @Override
    public String getName() {
        return RNPNativePaymentButtonManager.REACT_CLASS;
    }

    @NonNull
    @Override
    protected View createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new View(reactContext);
    }
}
