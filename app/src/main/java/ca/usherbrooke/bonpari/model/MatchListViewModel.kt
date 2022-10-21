package ca.usherbrooke.bonpari.model

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import ca.usherbrooke.bonpari.api.BonPariApi
import ca.usherbrooke.bonpari.api.BonPariFakeApi
import ca.usherbrooke.bonpari.api.Match
import kotlinx.coroutines.launch

class MatchListViewModel : ViewModel() {
    private var _matches = MutableLiveData(listOf<Match>())
    private var _selectedMatch = MutableLiveData<Match>(null)

    val matches: LiveData<List<Match>>
        get() = _matches

    val selectedMatch : LiveData<Match>
        get() = _selectedMatch

    init {
        refreshMatches()
    }

    fun refreshSelected() = internalRefreshSelected(false)

    private fun internalRefreshSelected(fromMatches: Boolean) {
        if (_selectedMatch.value == null) return
        if (fromMatches) {
            _selectedMatch.value?.apply {
                for (match in _matches.value!!) {
                    if (match.id == id) {
                        Log.d("CAL", "Update selected OK.")
                        _selectedMatch.value = match
                        break
                    }
                }
            }
        } else {
            viewModelScope.launch {
                try {
                    _selectedMatch.value = BonPariApi.retrofitService.getGame(_selectedMatch.value!!.id)
                    Log.d("CAL", "Update selected (only): ${_selectedMatch.value}")
                } catch (e: Exception) {
                    Log.e("CAL", e.message.toString())
                }
            }
        }
    }

    fun refreshMatches() {
        viewModelScope.launch {
            try {
                _matches.value = BonPariApi.retrofitService.getAllGames()
                internalRefreshSelected(true)
                Log.d("CAL", "Has found ${_matches.value!!.size} matches.")
            } catch (e: Exception) {
                Log.e("CAL", e.message.toString())
                _matches.value = BonPariFakeApi.retrofitService.getAllGames()
            }
        }
    }

    fun updateSelectedMatch(match: Match) {
        _selectedMatch.value = match
    }
}