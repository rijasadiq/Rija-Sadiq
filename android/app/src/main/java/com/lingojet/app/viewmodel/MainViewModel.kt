package com.lingojet.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

enum class Language(val displayName: String, val flag: String) {
    SWEDISH("Swedish", "🇸🇪"),
    ENGLISH("English", "🇬🇧"),
    URDU("Urdu", "🇵🇰"),
    TURKISH("Turkish", "🇹🇷"),
    KOREAN("Korean", "🇰🇷"),
    CHINESE("Chinese", "🇨🇳")
}

data class Badge(val id: String, val title: String, val description: String, val isUnlocked: Boolean)

class MainViewModel : ViewModel() {
    private val db = FirebaseFirestore.getInstance()
    private val auth = FirebaseAuth.getInstance()

    private val _currentLanguage = MutableStateFlow(Language.SWEDISH)
    val currentLanguage: StateFlow<Language> = _currentLanguage.asStateFlow()

    private val _streak = MutableStateFlow(5)
    val streak: StateFlow<Int> = _streak.asStateFlow()

    private val _isDarkMode = MutableStateFlow(false)
    val isDarkMode: StateFlow<Boolean> = _isDarkMode.asStateFlow()

    private val _badges = MutableStateFlow(listOf(
        Badge("first_steps", "First Steps", "Unlocked after completing your first activity.", false),
        Badge("polyglot", "Polyglot", "Practice activities in at least 2 different languages.", false),
        Badge("chatterbox", "Chatterbox", "Spend a total of 10 minutes in the AI Voice Chat.", false),
        Badge("perfect_score", "Perfect Score", "Get 100% on a Listening or Reading quiz.", false)
    ))
    val badges: StateFlow<List<Badge>> = _badges.asStateFlow()

    fun selectLanguage(language: Language) {
        val oldLanguage = _currentLanguage.value
        _currentLanguage.value = language
        
        // Polyglot trigger check
        if (oldLanguage != language) {
            unlockBadge("polyglot")
        }
    }

    fun completeActivity() {
        unlockBadge("first_steps")
        viewModelScope.launch {
            _streak.value += 1
            syncDataToCloud()
        }
    }

    fun quizPerfectScore() {
        unlockBadge("perfect_score")
    }

    fun toggleDarkMode() {
        _isDarkMode.value = !_isDarkMode.value
    }

    private fun unlockBadge(id: String) {
        _badges.value = _badges.value.map {
            if (it.id == id && !it.isUnlocked) it.copy(isUnlocked = true) else it
        }
    }

    private fun syncDataToCloud() {
        val userId = auth.currentUser?.uid ?: return
        val userData = mapOf(
            "streak" to _streak.value,
            "currentLanguage" to _currentLanguage.value.name,
            "darkMode" to _isDarkMode.value
        )
        db.collection("users").document(userId).set(userData)
    }
}
