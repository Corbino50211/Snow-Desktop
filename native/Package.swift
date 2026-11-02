// swift-tools-version:5.9
import PackageDescription
let package = Package(name: "SnowDesktop", platforms: [.macOS(.v14)], targets: [.executableTarget(name: "SnowDesktop", path: "Sources/SnowDesktop")])
