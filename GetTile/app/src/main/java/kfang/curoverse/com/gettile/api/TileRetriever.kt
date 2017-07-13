package kfang.curoverse.com.gettile.api

import kfang.curoverse.com.gettile.models.TileSearch
import retrofit2.Callback
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import javax.xml.datatype.DatatypeConstants.SECONDS
import okhttp3.OkHttpClient
import java.util.concurrent.TimeUnit


/**
 * Created by kfang on 7/13/17.
 */
class TileRetriever {
    private val service: TileSearchAPI
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
                .build()
        service = retrofit.create(TileSearchAPI::class.java)
    }

    fun getTile(index: Int, callback: Callback<TileSearch>) {
        val call = service.getTile(index)
        call.enqueue(callback)
    }

}