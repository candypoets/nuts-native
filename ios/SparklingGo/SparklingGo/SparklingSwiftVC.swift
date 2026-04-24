// Copyright 2025 The Sparkling Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import Foundation
import SwiftUI
import Sparkling

class SparklingLynxElement: SPKLynxElement {
    var lynxElementName: String
    
    var lynxElementClassName: AnyClass
    
    init(lynxElementName: String, lynxElementClassName: AnyClass) {
        self.lynxElementName = lynxElementName
        self.lynxElementClassName = lynxElementClassName
    }
}

#if DEBUG
class ReloadableNavigationController: UINavigationController {
    var sparklingVC: UIViewController?
    
    override var canBecomeFirstResponder: Bool { true }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        becomeFirstResponder()
    }
    
    override func motionEnded(_ motion: UIEvent.EventSubtype, with event: UIEvent?) {
        if motion == .motionShake {
            print("[DEBUG] Shake detected — reloading Lynx bundle...")
            if let container = sparklingVC as? SPKContainerProtocol {
                container.reload(nil)
            }
        }
        super.motionEnded(motion, with: event)
    }
}
#endif

struct SPKSwiftVC: UIViewControllerRepresentable {
    @State private var state_frame: CGRect
    
    init(state_frame: CGRect = .zero) {
        self.state_frame = state_frame
    }
    
    func makeUIViewController(context: Context) -> some UIViewController {
        #if DEBUG
        let url = "hybrid://lynxview_page?bundle=http://192.168.128.196:3002/main.lynx.bundle&hide_status_bar=1&hide_nav_bar=1"
        #else
        let url = "hybrid://lynxview_page?bundle=main.lynx.bundle&hide_status_bar=1&hide_nav_bar=1"
        #endif
        let context = SPKContext()
        let elements = SparklingLynxElement(lynxElementName: "input", lynxElementClassName: LynxInput.self)
        context.customUIElements = [elements]
        let vc = SPKRouter.create(withURL: url, context: context, frame: self.state_frame)
        
        #if DEBUG
        let naviVC = ReloadableNavigationController(rootViewController: vc)
        naviVC.sparklingVC = vc
        #else
        let naviVC = UINavigationController(rootViewController: vc)
        #endif
        return naviVC
    }
    
    func updateUIViewController(_ uiViewController: UIViewControllerType, context: Context) {
        
    }
}


struct DemoVC: View {
    var body: some View {
        GeometryReader { geometry in
            SPKSwiftVC(state_frame: geometry.frame(in: .local))
        }
        
    }
}
