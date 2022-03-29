//
//  MoodInputWidget.swift
//  MoodInputWidget
//
//  Created by Nirav on 30/09/21.
//

import WidgetKit
import SwiftUI
import Intents

struct WidgetData: Decodable {
   var text: String
}

struct Provider: IntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), configuration: ConfigurationIntent(), text: "Placeholder")
    }

    func getSnapshot(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), configuration: configuration, text: "Data goes here")
        completion(entry)
    }

    func getTimeline(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
//        var entries: [SimpleEntry] = []
//
//        // Generate a timeline consisting of five entries an hour apart, starting from the current date.
//        let currentDate = Date()
//        for hourOffset in 0 ..< 5 {
//            let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
//            let entry = SimpleEntry(date: entryDate, configuration: configuration)
//            entries.append(entry)
//        }
//
//        let timeline = Timeline(entries: entries, policy: .atEnd)
//        completion(timeline)
      var entries: [SimpleEntry] = []
      let userDefaults = UserDefaults.init(suiteName: "group.moodflo")
            if userDefaults != nil {
              let entryDate = Date()
              if let savedData = userDefaults!.value(forKey: "widgetKey") as? String {
                  let decoder = JSONDecoder()
                  let data = savedData.data(using: .utf8)
                  if let parsedData = try? decoder.decode(WidgetData.self, from: data!) {
                    let nextRefresh = Calendar.current.date(byAdding: .minute, value: 1, to: entryDate)!
                    let entry = SimpleEntry(date: nextRefresh, configuration: configuration, text: parsedData.text)
                    entries.append(entry)
                    let timeline = Timeline(entries: entries, policy: .atEnd)
                    completion(timeline)
                  } else {
                      print("Could not parse data")
                  }
              } else {
                  let nextRefresh = Calendar.current.date(byAdding: .minute, value: 1, to: entryDate)!
                  let entry = SimpleEntry(date: nextRefresh, configuration: configuration, text: "No data set")
                  entries.append(entry)
                  let timeline = Timeline(entries: entries, policy: .atEnd)
                  completion(timeline)
              }
            }
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let configuration: ConfigurationIntent
    let text: String
}

struct MoodInputWidgetEntryView : View {
    var entry: Provider.Entry

  var body: some View {
        VStack {
          Text(entry.text)
            .bold()
            .foregroundColor(.black)
        }.padding(50)
  }
}

@main
struct MoodInputWidget: Widget {
    let kind: String = "MoodInputWidget"

    var body: some WidgetConfiguration {
        IntentConfiguration(kind: kind, intent: ConfigurationIntent.self, provider: Provider()) { entry in
            MoodInputWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("My Widget")
        .description("This is an example widget.")
    }
}

struct MoodInputWidget_Previews: PreviewProvider {
    static var previews: some View {
        MoodInputWidgetEntryView(entry: SimpleEntry(date: Date(), configuration: ConfigurationIntent(), text: "Widget preview"))
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
