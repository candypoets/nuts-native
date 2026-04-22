// Copyright (c) 2025 TikTok Pte. Ltd.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.example.sparkling.go

import android.content.Context
import com.lynx.tasm.provider.AbsTemplateProvider
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.ByteArrayOutputStream
import java.io.IOException

class BuiltinTemplateProvider(context: Context) : AbsTemplateProvider() {

    private var mContext: Context = context.applicationContext
    private val httpClient = OkHttpClient()

    override fun loadTemplate(uri: String, callback: Callback) {
        Thread {
            try {
                if (uri.startsWith("http://") || uri.startsWith("https://")) {
                    fetchHttp(uri, callback)
                } else {
                    loadAsset(uri, callback)
                }
            } catch (e: Exception) {
                callback.onFailed(e.message)
            }
        }.start()
    }

    private fun fetchHttp(uri: String, callback: Callback) {
        val request = Request.Builder().url(uri).build()
        httpClient.newCall(request).execute().use { response ->
            if (!response.isSuccessful) {
                callback.onFailed("HTTP ${response.code}")
                return
            }
            val bytes = response.body?.bytes()
            if (bytes != null) {
                callback.onSuccess(bytes)
            } else {
                callback.onFailed("Empty response")
            }
        }
    }

    private fun loadAsset(uri: String, callback: Callback) {
        mContext.assets.open(uri).use { inputStream ->
            ByteArrayOutputStream().use { byteArrayOutputStream ->
                val buffer = ByteArray(1024)
                var length: Int
                while ((inputStream.read(buffer).also { length = it }) != -1) {
                    byteArrayOutputStream.write(buffer, 0, length)
                }
                callback.onSuccess(byteArrayOutputStream.toByteArray())
            }
        }
    }
}
