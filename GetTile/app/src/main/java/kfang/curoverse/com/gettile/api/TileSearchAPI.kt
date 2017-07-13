package kfang.curoverse.com.gettile.api

import kfang.curoverse.com.gettile.models.TileSearch
import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query

/**
 * Created by kfang on 7/13/17.
 */
interface TileSearchAPI {
    @GET("/tile")
    fun getTile(@Query("index") index: Int) : Call<TileSearch>
}