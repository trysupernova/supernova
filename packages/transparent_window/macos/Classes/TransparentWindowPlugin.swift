import Cocoa
import FlutterMacOS

public class TransparentWindowPlugin: NSObject, FlutterPlugin {
  private var window: NSWindow? // Keep a reference to the transparent window
  private var transparentWindowView: TransparentWindowView?


  public static func register(with registrar: FlutterPluginRegistrar) {
    let channel = FlutterMethodChannel(name: "transparent_window", binaryMessenger: registrar.messenger)
    let instance = TransparentWindowPlugin()
    registrar.addMethodCallDelegate(instance, channel: channel)
  }

  public func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
    switch call.method {
    case "activate":
      // Create and display the transparent window here
      window = NSWindow(
        contentRect: NSRect(x: 0, y: 0, width: 1000, height: 50),
        styleMask: [.borderless, .fullSizeContentView, .nonactivatingPanel, .titled],
        backing: .buffered,
        defer: false
      )
      window?.backgroundColor = .white
      window?.level = .floating
      window?.collectionBehavior.insert(.fullScreenAuxiliary)
      window?.collectionBehavior.insert(.canJoinAllSpaces)
      window?.titleVisibility = .hidden
      window?.titlebarAppearsTransparent = true
      window?.isMovable = false
      window?.isMovableByWindowBackground = false
      window?.isReleasedWhenClosed = false
      window?.isOpaque = false
      window?.delegate = self // Set the delegate to handle window events
      window?.center()
      window?.makeKeyAndOrderFront(nil)
      transparentWindowView = TransparentWindowView()
      transparentWindowView?.transparentWindow = window
      window?.contentView = transparentWindowView
      NSApp.activate(ignoringOtherApps: true)
      result(nil)
    default:
      result(FlutterMethodNotImplemented)
    }
  }
}

extension TransparentWindowPlugin: NSWindowDelegate {
    public func windowDidResignKey(_ notification: Notification) {
        // Close the window when it loses focus
        window?.close();
    }
}

class TransparentWindowView: NSView {
    var transparentWindow: NSWindow?
    
    override func keyDown(with event: NSEvent) {
        if event.keyCode == 53 { // KeyCode for "Escape" key
            // Close the transparent window when the "Escape" key is pressed
            transparentWindow?.close()
        }
    }
}