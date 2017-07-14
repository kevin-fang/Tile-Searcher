package com.curoverse.kfang.gettileinfo.model

/**
 * Created by kfang on 7/14/17.
 */
data class TileInfo (val search: ArrayList<String>,
                       val base_pair_start: String,
                       val base_pair_end: String,
                       val tile_path: String,
                       val tile_step: String,
                       val tile_phase: String,
                       val name: String,
                       val variants: ArrayList<String>) {
}