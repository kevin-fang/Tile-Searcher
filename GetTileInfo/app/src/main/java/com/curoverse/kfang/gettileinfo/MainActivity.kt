package com.curoverse.kfang.gettileinfo

import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.view.View
import android.widget.TextView
import android.widget.Toast
import com.curoverse.kfang.gettileinfo.api.TileRetriever
import com.curoverse.kfang.gettileinfo.model.TileInfo
import kotlinx.android.synthetic.main.activity_main.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MainActivity : AppCompatActivity() {

    lateinit var allViews: Array<TextView>
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        indeterminateBar.visibility = View.GONE
        allViews = arrayOf(bp_start, bp_end, base_pair_title, tile_name, to_search, tile_path, tile_step, tile_phase, variants)
        call_api.setOnClickListener {
            val index = getIndex()
            if (index == null) {
                index_input.error = "Empty input"
            } else {
                allViews.forEach { it.visibility = View.GONE }
                Toast.makeText(this, "Loading...", Toast.LENGTH_SHORT).show()
                makeCall(index)
            }
        }
    }

    private fun getIndex(): Int? {
        if (index_input.text.toString() == "") {
            return null
        } else {
            return Integer.parseInt(index_input.text.toString())
        }
    }


    fun makeCall(index: Int) {
        indeterminateBar.visibility = View.VISIBLE
        val retriever = TileRetriever()
        val callback = object: Callback<TileInfo> {
            override fun onResponse(call: Call<TileInfo>?, response: Response<TileInfo>?) {
                indeterminateBar.visibility = View.GONE
                //Toast.makeText(this@MainActivity, "Good results", Toast.LENGTH_SHORT).show();
                setViews(response?.body())
            }

            override fun onFailure(call: Call<TileInfo>?, t: Throwable?) {
                indeterminateBar.visibility = View.GONE
                Toast.makeText(this@MainActivity, "Invalid results. Check log.", Toast.LENGTH_SHORT).show();
                Log.d("MainActivity", "message: ", t)
            }
        }
        retriever.getTile(index, callback)
    }

    private fun setViews(body: TileInfo?) {
        if (body != null) {
            allViews.forEach { it.visibility = View.VISIBLE }
            bp_start.text = body.base_pair_start
            bp_end.text = body.base_pair_end
            tile_name.text = body.name
            to_search.text = resources.getString(R.string.to_search_list, body.search.toString())
            tile_path.text = resources.getString(R.string.tile_path_s, body.tile_path)
            tile_step.text = resources.getString(R.string.tile_step_s, body.tile_step)
            tile_phase.text = resources.getString(R.string.tile_phase_s, body.tile_phase)
            variants.text = getVariants(body.variants)
        } else {
            Toast.makeText(this, "Body is null", Toast.LENGTH_SHORT).show()
        }
    }

    private fun getVariants(variants: ArrayList<String>): String {
        val builder = StringBuilder()
        variants.forEach {
            builder.append(it + '\n')
        }
        return builder.toString()
    }
}
