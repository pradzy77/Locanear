import UIKit
import Capacitor
import CoreLocation

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, CLLocationManagerDelegate {

    var window: UIWindow?
    private var locationManager: CLLocationManager?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        setupLocationManager()
        return true
    }

    private func setupLocationManager() {
        let manager = CLLocationManager()
        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyBest
        manager.distanceFilter = 5.0
        
        // Memungkinkan pelacakan lokasi latar belakang terus berjalan (Zenly style)
        manager.allowsBackgroundLocationUpdates = true
        manager.pausesLocationUpdatesAutomatically = false
        if #available(iOS 11.0, *) {
            manager.showsBackgroundLocationIndicator = true
        }
        
        manager.requestAlwaysAuthorization()
        manager.startUpdatingLocation()
        manager.startMonitoringSignificantLocationChanges()
        self.locationManager = manager
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let latestLocation = locations.last else { return }
        // Keep process active & sync location in background
        NotificationCenter.default.post(
            name: NSNotification.Name("LocanearLocationUpdated"),
            object: latestLocation
        )
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("[Locanear iOS] Location error: \(error.localizedDescription)")
    }

    func applicationWillResignActive(_ application: UIApplication) {}

    func applicationDidEnterBackground(_ application: UIApplication) {
        locationManager?.startUpdatingLocation()
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        locationManager?.startUpdatingLocation()
    }

    func applicationDidBecomeActive(_ application: UIApplication) {}

    func applicationWillTerminate(_ application: UIApplication) {
        locationManager?.startMonitoringSignificantLocationChanges()
    }

    func application(_ application: UIApplication,
                     configurationForConnecting connectingSceneSession: UISceneSession,
                     options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        let config = UISceneConfiguration(name: "Default Configuration",
                                          sessionRole: connectingSceneSession.role)
        config.delegateClass = SceneDelegate.self
        return config
    }
}
