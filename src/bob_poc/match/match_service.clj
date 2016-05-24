(ns bob-poc.match.match-service
  (:require [clj-time.core :as t]
            [clojure.tools.logging :refer [info error debug]])
  (:import (org.joda.time Interval)))

(def ^:private full-band-list [{:id 1 :name "Metallica" :facebook "http://facebook.com/metallica" :votes 0}
                               {:id 2 :name "Slipknot" :facebook "http://facebook.com/slipknot" :votes 0}
                               {:id 3 :name "Foo Fighters" :facebook "http://facebook.com/foofighters" :votes 0}
                               {:id 4 :name "Gojira" :facebook "http://facebook.com/gojira" :votes 0}])

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

(defn start-match! [match-duration]
  (debug "Starting match with duration" (t/in-seconds match-duration) "seconds")
  (if (or (empty? @bands) (empty? @current-standoff))
    (start-first-match! match-duration)
    (start-next-match! match-duration)))

(defn get-current-match []
  (debug "Returning current standoff.")
  {:standoff @current-standoff :match @match-number :time (calc-match-time-left)})

(defn vote! [id]
  (debug "Increasing vote for band with id" id)
  (let [voted-standoff (swap! current-standoff #(map (fn [band] (inc-vote id band)) %))]
    (first (filter #(= (:id %) id) voted-standoff))))