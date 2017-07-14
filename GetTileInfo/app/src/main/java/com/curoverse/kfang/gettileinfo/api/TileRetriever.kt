package com.curoverse.kfang.gettileinfo.api

import com.curoverse.kfang.gettileinfo.model.TileInfo
import io.reactivex.Observable
import okhttp3.OkHttpClient
import retrofit2.Callback
import retrofit2.Retrofit
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory
import retrofit2.converter.gson.GsonConverterFactory
import java.util.*
import java.util.concurrent.TimeUnit

/**
 * Created by kfang on 7/14/17.
 */
class TileRetriever {
    private val service: TileSearchApi
    val okHttpClient: OkHttpClient

    init {
        okHttpClient = OkHttpClient.Builder()
                .readTimeout(60, TimeUnit.SECONDS)
                .connectTimeout(60, TimeUnit.SECONDS)
                .build()
    }

    init {
        val retrofit = Retrofit.Builder()
                .baseUrl("http://192.168.1.156:8082")
                .addConverterFactory(GsonConverterFactory.create())
                .client(okHttpClient)
                .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
                .build()
        service = retrofit.create(TileSearchApi::class.java)
    }

    fun getTile(index: Int) : Observable<TileInfo> = service.getTile(index)

}