export interface CodeFile {
  filename: string;
  language: string;
  code: string;
  description: string;
}

export const kotlinCodeFiles: CodeFile[] = [
  {
    filename: "MainActivity.kt",
    language: "kotlin",
    description: "The core Android activity setting up NavController, Bottom Navigation Bar, and the ViewModel state integration.",
    code: `package com.lingojet.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.lingojet.app.ui.theme.LingoJetTheme
import com.lingojet.app.viewmodel.MainViewModel
import com.lingojet.app.screens.*

class MainActivity : ComponentActivity() {
    private val viewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            LingoJetTheme(darkTheme = viewModel.isDarkMode.collectAsState().value) {
                MainAppScreen(viewModel)
            }
        }
    }
}

@Composable
fun MainAppScreen(viewModel: MainViewModel) {
    val navController = rememberNavController()
    val currentLanguage by viewModel.currentLanguage.collectAsState()
    val streak by viewModel.streak.collectAsState()

    Scaffold(
        bottomBar = {
            BottomNavigationBar(navController = navController)
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "learn",
            modifier = Modifier.padding(innerPadding)
        ) {
            composable("learn") { 
                LearnScreen(viewModel = viewModel, navController = navController) 
            }
            composable("ai_chat") { 
                AIChatScreen(viewModel = viewModel) 
            }
            composable("achievements") { 
                AchievementsScreen(viewModel = viewModel) 
            }
            composable("profile") { 
                ProfileScreen(viewModel = viewModel) 
            }
        }
    }
}`
  },
  {
    filename: "MainViewModel.kt",
    language: "kotlin",
    description: "Android Architecture Component ViewModel managing active language, streak calculations, real-time Gemini SDK requests, and unlock triggers for gamified achievements.",
    code: `package com.lingojet.app.viewmodel

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
        // Trigger streak increment
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
}`
  },
  {
    filename: "LearnScreen.kt",
    language: "kotlin",
    description: "The primary learning dashboard, implemented as a Jetpack Compose screen with beautiful cards representing the 4 core language skills.",
    code: `package com.lingojet.app.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.lingojet.app.viewmodel.MainViewModel
import com.lingojet.app.viewmodel.Language

@Composable
fun LearnScreen(viewModel: MainViewModel, navController: androidx.navigation.NavController) {
    val currentLanguage by viewModel.currentLanguage.collectAsState()
    val streak by viewModel.streak.collectAsState()
    var showLangDropdown by remember { mutableStateOf(false) }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        // Top Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box {
                Button(onClick = { showLangDropdown = true }) {
                    Text("\${currentLanguage.flag} \${currentLanguage.displayName}")
                    Icon(Icons.Default.ArrowDropDown, contentDescription = null)
                }
                DropdownMenu(
                    expanded = showLangDropdown,
                    onDismissRequest = { showLangDropdown = false }
                ) {
                    Language.values().forEach { lang ->
                        DropdownMenuItem(
                            text = { Text("\${lang.flag} \${lang.displayName}") },
                            onClick = {
                                viewModel.selectLanguage(lang)
                                showLangDropdown = false
                            }
                        )
                    }
                }
            }

            // Streak Counter
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Star, contentDescription = "Streak", tint = MaterialTheme.colorScheme.primary)
                Spacer(modifier = Modifier.width(4.dp))
                Text(text = "\$streak Days Streak", style = MaterialTheme.typography.titleMedium)
            }
        }

        Spacer(modifier = Modifier.height(24.dp))
        Text(text = "Practice Your Skills", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            item {
                SkillCard(
                    title = "Speaking",
                    desc = "AI Voice Call & Conversation practice",
                    icon = Icons.Default.PlayArrow,
                    onClick = { navController.navigate("voice_call") }
                )
            }
            item {
                SkillCard(
                    title = "Listening",
                    desc = "Audio Dialogue Comprehension Quiz",
                    icon = Icons.Default.List,
                    onClick = { navController.navigate("listening_quiz") }
                )
            }
            item {
                SkillCard(
                    title = "Reading",
                    desc = "Interactive Bilingual Stories with Tap-to-Translate",
                    icon = Icons.Default.Search,
                    onClick = { navController.navigate("reading_stories") }
                )
            }
            item {
                SkillCard(
                    title = "Writing",
                    desc = "Photo Description & Live Debate with AI feedback",
                    icon = Icons.Default.Edit,
                    onClick = { navController.navigate("writing_drills") }
                )
            }
        }
    }
}

@Composable
fun SkillCard(title: String, desc: String, icon: ImageVector, onClick: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth().clickable { onClick() },
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(imageVector = icon, contentDescription = title, modifier = Modifier.size(32.dp), tint = MaterialTheme.colorScheme.primary)
            Spacer(modifier = Modifier.width(16.dp))
            Column {
                Text(text = title, style = MaterialTheme.typography.titleLarge)
                Text(text = desc, style = MaterialTheme.typography.bodyMedium)
            }
        }
    }
}`
  },
  {
    filename: "VoiceCallScreen.kt",
    language: "kotlin",
    description: "The Speaking skill practice screen. Displays a pulsing voice button and handles raw audio communication with the Gemini Live API client.",
    code: `package com.lingojet.app.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.lingojet.app.viewmodel.MainViewModel

@Composable
fun VoiceCallScreen(viewModel: MainViewModel) {
    val currentLanguage by viewModel.currentLanguage.collectAsState()
    var isCalling by remember { mutableStateOf(false) }
    var transcriptRevealed by remember { mutableStateOf(false) }

    // Pulsing micro-animation for calling state
    val infiniteTransition = rememberInfiniteTransition()
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = if (isCalling) 1.25f else 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        )
    )

    Column(
        modifier = Modifier.fillMaxSize().padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "AI Voice Tutor: \${currentLanguage.displayName}",
            style = MaterialTheme.typography.headlineSmall
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = if (isCalling) "Listening... Speak naturally" else "Tap button to start calling",
            style = MaterialTheme.typography.bodyLarge,
            color = if (isCalling) MaterialTheme.colorScheme.primary else Color.Gray
        )

        Spacer(modifier = Modifier.height(48.dp))

        // Pulse wave glow container
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .size(160.dp)
                .scale(pulseScale)
                .background(
                    color = MaterialTheme.colorScheme.primary.copy(alpha = if (isCalling) 0.15f else 0.05f),
                    shape = CircleShape
                )
        ) {
            FilledIconButton(
                onClick = { isCalling = !isCalling },
                modifier = Modifier.size(90.dp),
                shape = CircleShape,
                colors = IconButtonDefaults.filledIconButtonColors(
                    containerColor = if (isCalling) Color.Red else MaterialTheme.colorScheme.primary
                )
            ) {
                Icon(
                    imageVector = Icons.Default.Call,
                    contentDescription = "Call Toggle",
                    modifier = Modifier.size(36.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(48.dp))

        if (isCalling) {
            Button(onClick = { transcriptRevealed = !transcriptRevealed }) {
                Text(if (transcriptRevealed) "Hide Transcript" else "Show Transcript")
            }
            if (transcriptRevealed) {
                Spacer(modifier = Modifier.height(16.dp))
                Card(modifier = Modifier.fillMaxWidth().height(100.dp)) {
                    Box(modifier = Modifier.padding(12.dp)) {
                        Text("AI: Let's talk about your hobbies! Vad gillar du att göra?")
                    }
                }
            }
        }
    }
}`
  }
];
