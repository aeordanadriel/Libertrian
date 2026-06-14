// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[derive(serde::Serialize)]
struct AssetAllocation {
    symbol: String,
    name: String,
    percentage: f64,
    value: f64,
    price: f64,
    change_24h: f64,
}

#[derive(serde::Serialize)]
struct PortfolioSummary {
    total_value: f64,
    net_worth: f64,
    debt: f64,
    assets: Vec<AssetAllocation>,
}

#[derive(serde::Serialize)]
struct RecoveryTrend {
    btc: Vec<f64>,
    sui: Vec<f64>,
    multiplier: String,
    btc_drop: String,
    alt_drop: String,
}

#[derive(serde::Serialize)]
struct AgentResponse {
    sender: String,
    text: String,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_portfolio_summary() -> PortfolioSummary {
    println!("=== get_portfolio_summary invoked ===");
    PortfolioSummary {
        total_value: 3672050.0,
        net_worth: 3672050.0,
        debt: 0.0,
        assets: vec![
            AssetAllocation {
                symbol: "BTC".to_string(),
                name: "Bitcoin".to_string(),
                percentage: 55.0,
                value: 2019627.5,
                price: 67320.92,
                change_24h: 2.4,
            },
            AssetAllocation {
                symbol: "ETH".to_string(),
                name: "Ethereum".to_string(),
                percentage: 21.0,
                value: 771130.5,
                price: 3482.12,
                change_24h: 1.1,
            },
            AssetAllocation {
                symbol: "SUI".to_string(),
                name: "Sui".to_string(),
                percentage: 15.0,
                value: 550807.5,
                price: 2.06,
                change_24h: 8.7,
            },
            AssetAllocation {
                symbol: "SOL".to_string(),
                name: "Solana".to_string(),
                percentage: 9.0,
                value: 330484.5,
                price: 145.72,
                change_24h: -0.4,
            },
        ],
    }
}

#[tauri::command]
fn simulate_recovery(scenario_idx: usize) -> RecoveryTrend {
    match scenario_idx {
        0 => RecoveryTrend {
            btc: vec![-12.4, -11.0, -9.5, -8.0, -7.2, -6.0, -5.1, -4.0, -3.2, -2.0, -1.1, -0.5, 0.0, 0.0, 0.0],
            sui: vec![-26.8, -24.0, -20.2, -15.0, -11.2, -7.0, -3.1, 1.0, 4.2, 8.0, 12.1, 15.0, 18.2, 21.6, 21.6],
            multiplier: "2.16x".to_string(),
            btc_drop: "-12.4%".to_string(),
            alt_drop: "-26.8%".to_string(),
        },
        1 => RecoveryTrend {
            btc: vec![-22.1, -20.0, -18.5, -16.2, -14.0, -12.5, -10.1, -8.0, -6.2, -4.0, -2.2, -1.0, 0.0, 0.0, 0.0],
            sui: vec![-48.5, -45.0, -40.0, -35.2, -30.0, -24.1, -18.0, -12.0, -6.1, 0.0, 5.2, 10.1, 15.0, 18.5, 18.5],
            multiplier: "2.19x".to_string(),
            btc_drop: "-22.1%".to_string(),
            alt_drop: "-48.5%".to_string(),
        },
        _ => RecoveryTrend {
            btc: vec![-50.3, -48.0, -45.2, -42.0, -38.5, -34.0, -30.1, -25.0, -20.2, -15.0, -10.1, -5.0, 0.0, 0.0, 0.0],
            sui: vec![-75.0, -70.0, -65.2, -58.0, -50.1, -42.0, -35.1, -28.0, -20.2, -12.0, -5.0, 2.1, 8.0, 12.5, 12.5],
            multiplier: "1.49x".to_string(),
            btc_drop: "-50.3%".to_string(),
            alt_drop: "-75.0%".to_string(),
        },
    }
}

#[tauri::command]
fn analyze_portfolio(message: &str) -> AgentResponse {
    let text = if message.to_lowercase().contains("sui") {
        "Running parameter sweep on SUI exposure...\n\nSui behaves as a high-beta proxy for BTC during liquidity stress, with a 2.16x recovery speed. Your 15% allocation accelerates portfolio rebound curves but introduces ~4.8% excess drawdown risk compared to a 100% BTC configuration.".to_string()
    } else if message.to_lowercase().contains("rebalance") || message.to_lowercase().contains("portfolio") {
        "Current Portfolio Split: 55% BTC, 15% SUI, 21% ETH, 9% SOL.\n\nRebalancing simulation suggests moving +5% from ETH into SUI shifts your overall beta from 1.62 to 1.85, accelerating the $3.6M net worth target by approximately 45 days, contingent on ALT/BTC trading desk demand.".to_string()
    } else {
        format!("Analyst parameters accepted for target query: \"{}\".\n\nSimulation indicates asset recovery profiles remain stable within their standard deviation curves. Portfolio beta coefficient stands at 1.74x relative to BTC.", message)
    };

    AgentResponse {
        sender: "Agent".to_string(),
        text,
    }
}

#[tauri::command]
async fn authenticate_biometrics() -> Result<bool, String> {
    println!("=== authenticate_biometrics invoked ===");
    #[cfg(target_os = "macos")]
    {
        use localauthentication::prelude::*;

        if let Ok(context) = LAContext::new() {
            if let Err(e) = context.set_localized_reason("Unlock your secure Libertrian Terminal session") {
                println!("LAContext setup error: {:?}", e);
                return Err(format!("LAContext setup error: {}", e));
            }

            // Check if Touch ID / Biometrics is available and configured
            let can_evaluate = context.can_evaluate_policy(LAPolicy::DeviceOwnerAuthentication);
            println!("can_evaluate_policy result: {:?}", can_evaluate);
            
            match can_evaluate {
                Ok(true) => {
                    println!("Triggering native macOS Touch ID prompt...");
                    // Trigger the native macOS Touch ID prompt!
                    match context.evaluate_policy(
                        LAPolicy::DeviceOwnerAuthentication,
                        "Verify your fingerprint to sign in"
                    ) {
                        Ok(_) => {
                            println!("Native Touch ID verification SUCCESS!");
                            return Ok(true);
                        }
                        Err(e) => {
                            println!("Native Touch ID verification FAILED: {:?}", e);
                            return Err(format!("Native Touch ID failed: {}", e));
                        }
                    }
                }
                err => {
                    println!("can_evaluate_policy failed, falling back to simulator. Error: {:?}", err);
                    // Fallback to simulated flow if not configured or has code-signing errors (e.g. -34018)
                    std::thread::sleep(std::time::Duration::from_millis(1200));
                    let time_ms = std::time::SystemTime::now()
                        .duration_since(std::time::UNIX_EPOCH)
                        .unwrap_or_default()
                        .as_millis();
                    if time_ms % 4 == 0 {
                        println!("Simulator fallback failed (random fail)");
                        return Err("Biometric check failed: Fingerprint unrecognized (Simulator Fallback).".to_string());
                    } else {
                        println!("Simulator fallback SUCCESS!");
                        return Ok(true);
                    }
                }
            }
        } else {
            println!("Failed to create LAContext");
        }
    }

    println!("Non-macOS fallback, running simulator...");
    // Default fallback for other operating systems (Windows/Linux) or context failure
    std::thread::sleep(std::time::Duration::from_millis(1200));
    let time_ms = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis();
    if time_ms % 4 == 0 {
        Err("Biometric check failed: Fingerprint unrecognized (Simulator Fallback).".to_string())
    } else {
        Ok(true)
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_portfolio_summary,
            simulate_recovery,
            analyze_portfolio,
            authenticate_biometrics
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
