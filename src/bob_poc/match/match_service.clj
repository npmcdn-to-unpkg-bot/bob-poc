(ns bob-poc.match.match-service
  (:require [clj-time.core :as t]
            [clojure.tools.logging :refer [info error debug]]
            [bob-poc.match.match-handler :refer [send-new-data-to-clients]])
  (:import (org.joda.time Interval)))

(def ^:private full-band-list [{:id 1 :name "Metallica" :soundcloud "https://soundcloud.com/redkaukasus/virago"
                                :image "http://previews.123rf.com/images/dorian2013/dorian20131509/dorian2013150900041/45913550-Small-planet-with-landmarks-around-the-world-Stock-Photo-world-travel-tour.jpg" :votes 0}
                               {:id 2 :name "Slipknot" :soundcloud "https://soundcloud.com/redkaukasus/celebration"
                                :image "http://previews.123rf.com/images/stockbroker/stockbroker1506/stockbroker150602259/41392692-Two-women-at-a-meeting-in-a-cafe-Stock-Photo-woman-women.jpg" :votes 0}
                               {:id 3 :name "Foo Fighters" :soundcloud "https://soundcloud.com/redkaukasus/flittermice"
                                :image "http://previews.123rf.com/images/iriana88w/iriana88w1409/iriana88w140900648/31574495-Small-grey-house-with-wooden-deck-Front-yard-with-flower-bed-and-lawn-Stock-Photo.jpg" :votes 0}
                               {:id 4 :name "Gojira" :soundcloud "https://soundcloud.com/redkaukasus/veil-kite"
                                :image "http://previews.123rf.com/images/stevanovicigor/stevanovicigor1511/stevanovicigor151100184/48597849-Real-estate-mortgage-concept-with-small-plastic-house-models-on-top-of-stacked-coins--Stock-Photo.jpg" :votes 0}])

(def ^:private match-number (atom 1))

(def ^:private bands (atom full-band-list))

(def ^:private current-standoff (atom []))

(def ^:private next-match-start (atom nil))

(defn- reset-next-match-start! [match-duration]
  (info "Resetting next match start!")
  (reset! next-match-start (t/plus (t/now) match-duration)))

(defn- select-band! []
  (info "Selecting a band...")
  (let [band (rand-nth @bands)]
    (swap! bands #(remove (fn [comp] (= (:id comp) (:id band))) %))
    band))

(defn- start-first-match! [match-duration]
  (info "Starting first match of the week!")
  (reset! bands full-band-list)
  (reset! match-number 1)
  (let [first-band (select-band!)
        second-band (select-band!)
        faceoff [first-band second-band]]
    (info "Selected bands:" faceoff)
    (reset! current-standoff faceoff)
    (reset-next-match-start! match-duration)))

(defn- start-next-match! [match-duration]
  (let [winner (apply max-key :votes @current-standoff)
        competitor (select-band!)
        faceoff [(assoc winner :votes 0) competitor]]
    (info "Selected bands:" faceoff)
    (reset! current-standoff faceoff)
    (swap! match-number inc)
    (reset-next-match-start! match-duration)))

(defn- inc-vote [id band]
  (if (= id (:id band))
    (update-in band [:votes] inc)
    band))

(defn- calc-match-time-left []
  (let [now (t/now)
        next-match @next-match-start]
    (if (t/before? now next-match)
      (.toDurationMillis ^Interval (t/interval now next-match))
      0)))

(defn- create-server-data []
  {:standoff @current-standoff :match @match-number :time (calc-match-time-left)})

(defn start-match! [match-duration]
  (debug "Starting match with duration" (t/in-seconds match-duration) "seconds")
  (if (or (empty? @bands) (empty? @current-standoff))
    (start-first-match! match-duration)
    (start-next-match! match-duration))
  (send-new-data-to-clients (create-server-data)))

(defn get-current-match []
  (debug "Returning current standoff.")
  (create-server-data))

(defn vote! [id]
  (debug "Increasing vote for band with id" id)
  (let [voted-standoff (swap! current-standoff #(map (fn [band] (inc-vote id band)) %))]
    (send-new-data-to-clients (create-server-data))
    (first (filter #(= (:id %) id) voted-standoff))))