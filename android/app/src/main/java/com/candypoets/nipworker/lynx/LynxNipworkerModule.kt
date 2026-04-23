package com.candypoets.nipworker.lynx

import android.content.Context
import com.lynx.jsbridge.LynxModule
import com.lynx.jsbridge.LynxMethod
import com.lynx.react.bridge.Callback
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.atomic.AtomicLong

/**
 * Lynx native module for NIPWorker (legacy com.lynx.jsbridge.LynxModule API).
 *
 * Host app must register this module via SparklingLynxConfig.Builder.addLynxModules().
 *
 * The shared library "libnipworker_native_ffi.so" must be bundled in the APK.
 */
class NipworkerLynxModule(context: Context) : LynxModule(context) {

    companion object {
        init {
            System.loadLibrary("nipworker_native_ffi")
        }

        private val callbacks = ConcurrentHashMap<Long, Callback>()
        private val nextUserdata = AtomicLong(1L)

        /**
         * Invoked by the JNI C bridge when the Rust engine emits data.
         * The [userdata] value is the one originally passed to [nipworkerInit].
         */
        @JvmStatic
        fun onNativeData(userdata: Long, data: ByteArray) {
            callbacks[userdata]?.invoke(data)
        }

        @JvmStatic
        external fun nipworkerInit(userdata: Long): Long

        @JvmStatic
        external fun nipworkerHandleMessage(handle: Long, bytes: ByteArray)

        @JvmStatic
        external fun nipworkerSetPrivateKey(handle: Long, secret: String)

        @JvmStatic
        external fun nipworkerDeinit(handle: Long)

        @JvmStatic
        external fun nipworkerFreeBytes(ptr: Long, len: Long)
    }

    private var handle: Long = 0L
    private var userdata: Long = 0L

    @LynxMethod
    fun init(callback: Callback) {
        userdata = nextUserdata.getAndIncrement()
        handle = nipworkerInit(userdata)
        if (handle != 0L) {
            callbacks[userdata] = callback
        }
    }

    @LynxMethod
    fun handleMessage(bytes: ByteArray) {
        if (handle != 0L) {
            nipworkerHandleMessage(handle, bytes)
        }
    }

    @LynxMethod
    fun setPrivateKey(secret: String) {
        if (handle != 0L) {
            nipworkerSetPrivateKey(handle, secret)
        }
    }

    @LynxMethod
    fun deinit() {
        if (handle != 0L) {
            callbacks.remove(userdata)
            nipworkerDeinit(handle)
            handle = 0
            userdata = 0
        }
    }
}
