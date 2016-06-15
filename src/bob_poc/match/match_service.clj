(ns bob-poc.match.match-service
  (:require [clj-time.core :as t]
            [clojure.tools.logging :refer [info error debug]]
            [bob-poc.match.match-handler :refer [send-new-data-to-clients]]
            [bob-poc.application.data :refer [get-bands]])
  (:import (org.joda.time Interval)))

(def ^:private match-number (atom 0))
(def ^:private bands (atom []))
(def ^:private current-standoff (atom []))
(def ^:private next-match-start (atom nil))

(defn reset-all-data! []
  (reset! match-number 0)
  (reset! bands (get-bands))
  (reset! current-standoff [])
  (reset! next-match-start nil))

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
  (reset! bands (get-bands))
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
    (if (and next-match (t/before? now next-match))
      (.toDurationMillis ^Interval (t/interval now next-match))
      0)))

(defn- create-server-data []
  {:standoff @current-standoff :match @match-number :time (calc-match-time-left)})

(defn- start-first-or-next [match-duration]
  (debug "Starting match with duration" (t/in-seconds match-duration) "seconds")
  (if (or (empty? @bands) (empty? @current-standoff))
    (start-first-match! match-duration)
    (start-next-match! match-duration))
  (send-new-data-to-clients (create-server-data)))

(defn start-match! [match-duration]
  (debug "Start match")
  (debug @bands)
  (if-not (empty? @bands)
    (start-first-or-next match-duration)))

(defn get-current-match []
  (debug "Returning current standoff.")
  (create-server-data))

(defn vote! [id]
  (debug "Increasing vote for band with id" id)
  (let [voted-standoff (swap! current-standoff #(map (fn [band] (inc-vote id band)) %))]
    (send-new-data-to-clients (create-server-data))
    (first (filter #(= (:id %) id) voted-standoff))))

(defn add-new-bands [new-bands]
  (reset! bands new-bands))