//! Offline build: no network client or external updater.
pub struct Release { pub version: String, pub url: String }
pub fn check() -> Result<Option<Release>, String> { Ok(None) }
pub fn open(_url: &str) {} // No remote launch path in this build.
