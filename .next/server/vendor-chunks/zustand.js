"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/zustand";
exports.ids = ["vendor-chunks/zustand"];
exports.modules = {

/***/ "(ssr)/./node_modules/zustand/esm/index.js":
/*!*******************************************!*\
  !*** ./node_modules/zustand/esm/index.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ create)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"(ssr)/./node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n\n\nfunction createStore(createState) {\n  let state;\n  const listeners = /* @__PURE__ */ new Set();\n  const setState = (partial, replace) => {\n    const nextState = typeof partial === \"function\" ? partial(state) : partial;\n    if (nextState !== state) {\n      const previousState = state;\n      state = replace ? nextState : Object.assign({}, state, nextState);\n      listeners.forEach((listener) => listener(state, previousState));\n    }\n  };\n  const getState = () => state;\n  const subscribeWithSelector = (listener, selector = getState, equalityFn = Object.is) => {\n    console.warn(\"[DEPRECATED] Please use `subscribeWithSelector` middleware\");\n    let currentSlice = selector(state);\n    function listenerToAdd() {\n      const nextSlice = selector(state);\n      if (!equalityFn(currentSlice, nextSlice)) {\n        const previousSlice = currentSlice;\n        listener(currentSlice = nextSlice, previousSlice);\n      }\n    }\n    listeners.add(listenerToAdd);\n    return () => listeners.delete(listenerToAdd);\n  };\n  const subscribe = (listener, selector, equalityFn) => {\n    if (selector || equalityFn) {\n      return subscribeWithSelector(listener, selector, equalityFn);\n    }\n    listeners.add(listener);\n    return () => listeners.delete(listener);\n  };\n  const destroy = () => listeners.clear();\n  const api = { setState, getState, subscribe, destroy };\n  state = createState(setState, getState, api);\n  return api;\n}\n\nconst isSSR = typeof window === \"undefined\" || !window.navigator || /ServerSideRendering|^Deno\\//.test(window.navigator.userAgent);\nconst useIsomorphicLayoutEffect = isSSR ? react__WEBPACK_IMPORTED_MODULE_0__.useEffect : react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect;\nfunction create(createState) {\n  const api = typeof createState === \"function\" ? createStore(createState) : createState;\n  const useStore = (selector = api.getState, equalityFn = Object.is) => {\n    const [, forceUpdate] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useReducer)((c) => c + 1, 0);\n    const state = api.getState();\n    const stateRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(state);\n    const selectorRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(selector);\n    const equalityFnRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(equalityFn);\n    const erroredRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);\n    const currentSliceRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();\n    if (currentSliceRef.current === void 0) {\n      currentSliceRef.current = selector(state);\n    }\n    let newStateSlice;\n    let hasNewStateSlice = false;\n    if (stateRef.current !== state || selectorRef.current !== selector || equalityFnRef.current !== equalityFn || erroredRef.current) {\n      newStateSlice = selector(state);\n      hasNewStateSlice = !equalityFn(currentSliceRef.current, newStateSlice);\n    }\n    useIsomorphicLayoutEffect(() => {\n      if (hasNewStateSlice) {\n        currentSliceRef.current = newStateSlice;\n      }\n      stateRef.current = state;\n      selectorRef.current = selector;\n      equalityFnRef.current = equalityFn;\n      erroredRef.current = false;\n    });\n    const stateBeforeSubscriptionRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(state);\n    useIsomorphicLayoutEffect(() => {\n      const listener = () => {\n        try {\n          const nextState = api.getState();\n          const nextStateSlice = selectorRef.current(nextState);\n          if (!equalityFnRef.current(currentSliceRef.current, nextStateSlice)) {\n            stateRef.current = nextState;\n            currentSliceRef.current = nextStateSlice;\n            forceUpdate();\n          }\n        } catch (error) {\n          erroredRef.current = true;\n          forceUpdate();\n        }\n      };\n      const unsubscribe = api.subscribe(listener);\n      if (api.getState() !== stateBeforeSubscriptionRef.current) {\n        listener();\n      }\n      return unsubscribe;\n    }, []);\n    const sliceToReturn = hasNewStateSlice ? newStateSlice : currentSliceRef.current;\n    (0,react__WEBPACK_IMPORTED_MODULE_0__.useDebugValue)(sliceToReturn);\n    return sliceToReturn;\n  };\n  Object.assign(useStore, api);\n  useStore[Symbol.iterator] = function() {\n    console.warn(\"[useStore, api] = create() is deprecated and will be removed in v4\");\n    const items = [useStore, api];\n    return {\n      next() {\n        const done = items.length <= 0;\n        return { value: items.shift(), done };\n      }\n    };\n  };\n  return useStore;\n}\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvenVzdGFuZC9lc20vaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQXNGOztBQUV0RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRDtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQ0FBMEMsNENBQVMsR0FBRyxrREFBZTtBQUNyRTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsaURBQVU7QUFDdEM7QUFDQSxxQkFBcUIsNkNBQU07QUFDM0Isd0JBQXdCLDZDQUFNO0FBQzlCLDBCQUEwQiw2Q0FBTTtBQUNoQyx1QkFBdUIsNkNBQU07QUFDN0IsNEJBQTRCLDZDQUFNO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsdUNBQXVDLDZDQUFNO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLElBQUksb0RBQWE7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRTZCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbW9sZWN1bGV2aWV3Ly4vbm9kZV9tb2R1bGVzL3p1c3RhbmQvZXNtL2luZGV4LmpzP2ZlZjYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlUmVkdWNlciwgdXNlUmVmLCB1c2VEZWJ1Z1ZhbHVlLCB1c2VFZmZlY3QsIHVzZUxheW91dEVmZmVjdCB9IGZyb20gJ3JlYWN0JztcblxuZnVuY3Rpb24gY3JlYXRlU3RvcmUoY3JlYXRlU3RhdGUpIHtcbiAgbGV0IHN0YXRlO1xuICBjb25zdCBsaXN0ZW5lcnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuICBjb25zdCBzZXRTdGF0ZSA9IChwYXJ0aWFsLCByZXBsYWNlKSA9PiB7XG4gICAgY29uc3QgbmV4dFN0YXRlID0gdHlwZW9mIHBhcnRpYWwgPT09IFwiZnVuY3Rpb25cIiA/IHBhcnRpYWwoc3RhdGUpIDogcGFydGlhbDtcbiAgICBpZiAobmV4dFN0YXRlICE9PSBzdGF0ZSkge1xuICAgICAgY29uc3QgcHJldmlvdXNTdGF0ZSA9IHN0YXRlO1xuICAgICAgc3RhdGUgPSByZXBsYWNlID8gbmV4dFN0YXRlIDogT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIG5leHRTdGF0ZSk7XG4gICAgICBsaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IGxpc3RlbmVyKHN0YXRlLCBwcmV2aW91c1N0YXRlKSk7XG4gICAgfVxuICB9O1xuICBjb25zdCBnZXRTdGF0ZSA9ICgpID0+IHN0YXRlO1xuICBjb25zdCBzdWJzY3JpYmVXaXRoU2VsZWN0b3IgPSAobGlzdGVuZXIsIHNlbGVjdG9yID0gZ2V0U3RhdGUsIGVxdWFsaXR5Rm4gPSBPYmplY3QuaXMpID0+IHtcbiAgICBjb25zb2xlLndhcm4oXCJbREVQUkVDQVRFRF0gUGxlYXNlIHVzZSBgc3Vic2NyaWJlV2l0aFNlbGVjdG9yYCBtaWRkbGV3YXJlXCIpO1xuICAgIGxldCBjdXJyZW50U2xpY2UgPSBzZWxlY3RvcihzdGF0ZSk7XG4gICAgZnVuY3Rpb24gbGlzdGVuZXJUb0FkZCgpIHtcbiAgICAgIGNvbnN0IG5leHRTbGljZSA9IHNlbGVjdG9yKHN0YXRlKTtcbiAgICAgIGlmICghZXF1YWxpdHlGbihjdXJyZW50U2xpY2UsIG5leHRTbGljZSkpIHtcbiAgICAgICAgY29uc3QgcHJldmlvdXNTbGljZSA9IGN1cnJlbnRTbGljZTtcbiAgICAgICAgbGlzdGVuZXIoY3VycmVudFNsaWNlID0gbmV4dFNsaWNlLCBwcmV2aW91c1NsaWNlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGlzdGVuZXJzLmFkZChsaXN0ZW5lclRvQWRkKTtcbiAgICByZXR1cm4gKCkgPT4gbGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lclRvQWRkKTtcbiAgfTtcbiAgY29uc3Qgc3Vic2NyaWJlID0gKGxpc3RlbmVyLCBzZWxlY3RvciwgZXF1YWxpdHlGbikgPT4ge1xuICAgIGlmIChzZWxlY3RvciB8fCBlcXVhbGl0eUZuKSB7XG4gICAgICByZXR1cm4gc3Vic2NyaWJlV2l0aFNlbGVjdG9yKGxpc3RlbmVyLCBzZWxlY3RvciwgZXF1YWxpdHlGbik7XG4gICAgfVxuICAgIGxpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICAgIHJldHVybiAoKSA9PiBsaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgfTtcbiAgY29uc3QgZGVzdHJveSA9ICgpID0+IGxpc3RlbmVycy5jbGVhcigpO1xuICBjb25zdCBhcGkgPSB7IHNldFN0YXRlLCBnZXRTdGF0ZSwgc3Vic2NyaWJlLCBkZXN0cm95IH07XG4gIHN0YXRlID0gY3JlYXRlU3RhdGUoc2V0U3RhdGUsIGdldFN0YXRlLCBhcGkpO1xuICByZXR1cm4gYXBpO1xufVxuXG5jb25zdCBpc1NTUiA9IHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIgfHwgIXdpbmRvdy5uYXZpZ2F0b3IgfHwgL1NlcnZlclNpZGVSZW5kZXJpbmd8XkRlbm9cXC8vLnRlc3Qod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO1xuY29uc3QgdXNlSXNvbW9ycGhpY0xheW91dEVmZmVjdCA9IGlzU1NSID8gdXNlRWZmZWN0IDogdXNlTGF5b3V0RWZmZWN0O1xuZnVuY3Rpb24gY3JlYXRlKGNyZWF0ZVN0YXRlKSB7XG4gIGNvbnN0IGFwaSA9IHR5cGVvZiBjcmVhdGVTdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gY3JlYXRlU3RvcmUoY3JlYXRlU3RhdGUpIDogY3JlYXRlU3RhdGU7XG4gIGNvbnN0IHVzZVN0b3JlID0gKHNlbGVjdG9yID0gYXBpLmdldFN0YXRlLCBlcXVhbGl0eUZuID0gT2JqZWN0LmlzKSA9PiB7XG4gICAgY29uc3QgWywgZm9yY2VVcGRhdGVdID0gdXNlUmVkdWNlcigoYykgPT4gYyArIDEsIDApO1xuICAgIGNvbnN0IHN0YXRlID0gYXBpLmdldFN0YXRlKCk7XG4gICAgY29uc3Qgc3RhdGVSZWYgPSB1c2VSZWYoc3RhdGUpO1xuICAgIGNvbnN0IHNlbGVjdG9yUmVmID0gdXNlUmVmKHNlbGVjdG9yKTtcbiAgICBjb25zdCBlcXVhbGl0eUZuUmVmID0gdXNlUmVmKGVxdWFsaXR5Rm4pO1xuICAgIGNvbnN0IGVycm9yZWRSZWYgPSB1c2VSZWYoZmFsc2UpO1xuICAgIGNvbnN0IGN1cnJlbnRTbGljZVJlZiA9IHVzZVJlZigpO1xuICAgIGlmIChjdXJyZW50U2xpY2VSZWYuY3VycmVudCA9PT0gdm9pZCAwKSB7XG4gICAgICBjdXJyZW50U2xpY2VSZWYuY3VycmVudCA9IHNlbGVjdG9yKHN0YXRlKTtcbiAgICB9XG4gICAgbGV0IG5ld1N0YXRlU2xpY2U7XG4gICAgbGV0IGhhc05ld1N0YXRlU2xpY2UgPSBmYWxzZTtcbiAgICBpZiAoc3RhdGVSZWYuY3VycmVudCAhPT0gc3RhdGUgfHwgc2VsZWN0b3JSZWYuY3VycmVudCAhPT0gc2VsZWN0b3IgfHwgZXF1YWxpdHlGblJlZi5jdXJyZW50ICE9PSBlcXVhbGl0eUZuIHx8IGVycm9yZWRSZWYuY3VycmVudCkge1xuICAgICAgbmV3U3RhdGVTbGljZSA9IHNlbGVjdG9yKHN0YXRlKTtcbiAgICAgIGhhc05ld1N0YXRlU2xpY2UgPSAhZXF1YWxpdHlGbihjdXJyZW50U2xpY2VSZWYuY3VycmVudCwgbmV3U3RhdGVTbGljZSk7XG4gICAgfVxuICAgIHVzZUlzb21vcnBoaWNMYXlvdXRFZmZlY3QoKCkgPT4ge1xuICAgICAgaWYgKGhhc05ld1N0YXRlU2xpY2UpIHtcbiAgICAgICAgY3VycmVudFNsaWNlUmVmLmN1cnJlbnQgPSBuZXdTdGF0ZVNsaWNlO1xuICAgICAgfVxuICAgICAgc3RhdGVSZWYuY3VycmVudCA9IHN0YXRlO1xuICAgICAgc2VsZWN0b3JSZWYuY3VycmVudCA9IHNlbGVjdG9yO1xuICAgICAgZXF1YWxpdHlGblJlZi5jdXJyZW50ID0gZXF1YWxpdHlGbjtcbiAgICAgIGVycm9yZWRSZWYuY3VycmVudCA9IGZhbHNlO1xuICAgIH0pO1xuICAgIGNvbnN0IHN0YXRlQmVmb3JlU3Vic2NyaXB0aW9uUmVmID0gdXNlUmVmKHN0YXRlKTtcbiAgICB1c2VJc29tb3JwaGljTGF5b3V0RWZmZWN0KCgpID0+IHtcbiAgICAgIGNvbnN0IGxpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IG5leHRTdGF0ZSA9IGFwaS5nZXRTdGF0ZSgpO1xuICAgICAgICAgIGNvbnN0IG5leHRTdGF0ZVNsaWNlID0gc2VsZWN0b3JSZWYuY3VycmVudChuZXh0U3RhdGUpO1xuICAgICAgICAgIGlmICghZXF1YWxpdHlGblJlZi5jdXJyZW50KGN1cnJlbnRTbGljZVJlZi5jdXJyZW50LCBuZXh0U3RhdGVTbGljZSkpIHtcbiAgICAgICAgICAgIHN0YXRlUmVmLmN1cnJlbnQgPSBuZXh0U3RhdGU7XG4gICAgICAgICAgICBjdXJyZW50U2xpY2VSZWYuY3VycmVudCA9IG5leHRTdGF0ZVNsaWNlO1xuICAgICAgICAgICAgZm9yY2VVcGRhdGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZXJyb3JlZFJlZi5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgICBmb3JjZVVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY29uc3QgdW5zdWJzY3JpYmUgPSBhcGkuc3Vic2NyaWJlKGxpc3RlbmVyKTtcbiAgICAgIGlmIChhcGkuZ2V0U3RhdGUoKSAhPT0gc3RhdGVCZWZvcmVTdWJzY3JpcHRpb25SZWYuY3VycmVudCkge1xuICAgICAgICBsaXN0ZW5lcigpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHVuc3Vic2NyaWJlO1xuICAgIH0sIFtdKTtcbiAgICBjb25zdCBzbGljZVRvUmV0dXJuID0gaGFzTmV3U3RhdGVTbGljZSA/IG5ld1N0YXRlU2xpY2UgOiBjdXJyZW50U2xpY2VSZWYuY3VycmVudDtcbiAgICB1c2VEZWJ1Z1ZhbHVlKHNsaWNlVG9SZXR1cm4pO1xuICAgIHJldHVybiBzbGljZVRvUmV0dXJuO1xuICB9O1xuICBPYmplY3QuYXNzaWduKHVzZVN0b3JlLCBhcGkpO1xuICB1c2VTdG9yZVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKFwiW3VzZVN0b3JlLCBhcGldID0gY3JlYXRlKCkgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHY0XCIpO1xuICAgIGNvbnN0IGl0ZW1zID0gW3VzZVN0b3JlLCBhcGldO1xuICAgIHJldHVybiB7XG4gICAgICBuZXh0KCkge1xuICAgICAgICBjb25zdCBkb25lID0gaXRlbXMubGVuZ3RoIDw9IDA7XG4gICAgICAgIHJldHVybiB7IHZhbHVlOiBpdGVtcy5zaGlmdCgpLCBkb25lIH07XG4gICAgICB9XG4gICAgfTtcbiAgfTtcbiAgcmV0dXJuIHVzZVN0b3JlO1xufVxuXG5leHBvcnQgeyBjcmVhdGUgYXMgZGVmYXVsdCB9O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/zustand/esm/index.js\n");

/***/ })

};
;