package kfang.curoverse.com.gettile.models

/**
 * TileSearch Api
 */
data class TileSearch (val search: ArrayList<String>,
                       val base_pair_start: String,
                       val base_pair_end: String,
                       val tile_path: String,
                       val tile_step: String,
                       val tile_phase: String,
                       val name: String,
                       val variants: ArrayList<String>) {
}