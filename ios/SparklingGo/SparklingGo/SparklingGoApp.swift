// Copyright 2025 The Sparkling Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import SwiftUI
import Lynx
import Sparkling
import SDWebImage
import SDWebImageWebPCoder
import SparklingMethod

class AppDelegate: NSObject, UIApplicationDelegate {
    var window: UIWindow?
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
        window = UIWindow(frame: UIScreen.main.bounds)
        let webPCoder = SDImageWebPCoder.shared
        SDImageCodersManager.shared.addCoder(webPCoder)
        
        SPKServiceRegister.registerAll()
        SPKExecuteAllPrepareBootTask()
        // Swift 6 / Xcode 26 workaround: @_section/@_used pre-registration fails,
        // so we manually call the prepare tasks that would normally be discovered
        // via the __DATA,SPK_PRE_SVC Mach-O section.
        SPKLynxService.executePrepareServiceTask()
        SPKResourceLoaderImpl.executePrepareServiceTask()
        SPKKit.DIContainer.register(SPKTrackerService.self, scope: ServiceScope.transient) {
            SparklingGoTrackerService()
        }
        return true
    }
}

@main
struct SparklingGoApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    var body: some Scene {
        WindowGroup {
            DemoVC()
        }
    }
}
