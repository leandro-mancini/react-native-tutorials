package com.loginanimated

import android.animation.AnimatorInflater
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity

class SplashActivity : AppCompatActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    setTheme(R.style.SplashTheme)
    super.onCreate(savedInstanceState)
    setContentView(R.layout.splash_layout)

    val logo: ImageView = findViewById(R.id.logo)
    val animator = AnimatorInflater.loadAnimator(this, R.animator.logo_pulse)
    animator.setTarget(logo)
    animator.start()

    // Avança para a MainActivity após um pequeno atraso
    Handler(Looper.getMainLooper()).postDelayed({
      startActivity(Intent(this, MainActivity::class.java))
      finish()
    }, 1200)
  }
}
