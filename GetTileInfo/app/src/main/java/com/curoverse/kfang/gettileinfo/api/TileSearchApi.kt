package com.curoverse.kfang.gettileinfo.api

import com.curoverse.kfang.gettileinfo.model.TileInfo
import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.Query

/**
 * Created by kfang on 7/14/17.
 */
interface TileSearchApi {
    @GET("/tile")
    fun getTile(@Query("index") index: Int) : Call<TileInfo>
}