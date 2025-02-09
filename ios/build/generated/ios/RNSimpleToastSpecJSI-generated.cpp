/**
 * This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
 *
 * Do not edit this file as changes may cause incorrect behavior and will be lost
 * once the code is regenerated.
 *
 * @generated by codegen project: GenerateModuleCpp.js
 */

#include "RNSimpleToastSpecJSI.h"

namespace facebook::react {

static jsi::Value __hostFunction_NativeSimpleToastCxxSpecJSI_getConstants(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeSimpleToastCxxSpecJSI *>(&turboModule)->getConstants(
    rt
  );
}
static jsi::Value __hostFunction_NativeSimpleToastCxxSpecJSI_show(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<NativeSimpleToastCxxSpecJSI *>(&turboModule)->show(
    rt,
    args[0].asString(rt),
    args[1].asNumber(),
    count <= 2 || args[2].isNull() || args[2].isUndefined() ? std::nullopt : std::make_optional(args[2].asObject(rt))
  );
  return jsi::Value::undefined();
}
static jsi::Value __hostFunction_NativeSimpleToastCxxSpecJSI_showWithGravity(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<NativeSimpleToastCxxSpecJSI *>(&turboModule)->showWithGravity(
    rt,
    args[0].asString(rt),
    args[1].asNumber(),
    args[2].asNumber(),
    count <= 3 || args[3].isNull() || args[3].isUndefined() ? std::nullopt : std::make_optional(args[3].asObject(rt))
  );
  return jsi::Value::undefined();
}
static jsi::Value __hostFunction_NativeSimpleToastCxxSpecJSI_showWithGravityAndOffset(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<NativeSimpleToastCxxSpecJSI *>(&turboModule)->showWithGravityAndOffset(
    rt,
    args[0].asString(rt),
    args[1].asNumber(),
    args[2].asNumber(),
    args[3].asNumber(),
    args[4].asNumber(),
    count <= 5 || args[5].isNull() || args[5].isUndefined() ? std::nullopt : std::make_optional(args[5].asObject(rt))
  );
  return jsi::Value::undefined();
}

NativeSimpleToastCxxSpecJSI::NativeSimpleToastCxxSpecJSI(std::shared_ptr<CallInvoker> jsInvoker)
  : TurboModule("RNSimpleToast", jsInvoker) {
  methodMap_["getConstants"] = MethodMetadata {0, __hostFunction_NativeSimpleToastCxxSpecJSI_getConstants};
  methodMap_["show"] = MethodMetadata {3, __hostFunction_NativeSimpleToastCxxSpecJSI_show};
  methodMap_["showWithGravity"] = MethodMetadata {4, __hostFunction_NativeSimpleToastCxxSpecJSI_showWithGravity};
  methodMap_["showWithGravityAndOffset"] = MethodMetadata {6, __hostFunction_NativeSimpleToastCxxSpecJSI_showWithGravityAndOffset};
}


} // namespace facebook::react
