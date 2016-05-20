(ns bob-poc.match.match-service
  (:require [clj-time.core :as t]
            [clojure.tools.logging :refer [info error]])
  (:import (org.joda.time Interval)))

(def ^:private bands (atom [{:id 1 :band-name "Metallica" :facebook "http://facebook.com/metallica"}
                            {:id 2 :band-name "Slipknot" :facebook "http://facebook.com/slipknot"}
                            {:id 3 :band-name "Foo Fighters" :facebook "http://facebook.com/foofighters"}
                            {:id 4 :band-name "Gojira" :facebook "http://facebook.com/gojira"}]))

(def ^:private match-duration (t/minutes 2))

(def ^:private current-standoff (atom []))

(def ^:private next-match-start (atom nil))

(defn- reset-next-match-start! []
  (info "Resetting next match start!")
  (reset! next-match-start (t/plus (t/now) match-duration)))

(defn- select-band! []
  (info "Selecting a band...")
  (let [band (rand-nth @bands)]
    (swap! bands #(remove (fn [comp] (= (:id comp) (:id band))) %))
    band))

(defn- start-first-match []
  (info "Starting first match of the week!")
  (let [first-band (select-band!)
        second-band (select-band!)
        faceoff [(conj first-band {:votes 0}) (conj second-band {:votes 0})]]
    (info "Selected bands:" faceoff)
    (reset! current-standoff faceoff)
    (reset-next-match-start!)))

(defn- start-next-match []
  (let [winner (apply max-key :votes @current-standoff)
        competitor (select-band!)
        faceoff [(conj winner {:votes 0}) (conj competitor {:votes 0})]]
    (info "Selected bands:" faceoff)
    (reset! current-standoff faceoff)
    (reset-next-match-start!)))

(defn- inc-vote [id band]
  (info "Increasing with one vote" id band)
  (if (= id (:id band))
    (update-in band [:votes] inc)
    band))

(defn- calc-match-time-left []
  (let [now (t/now)
        next-match @next-match-start]
    (if (t/before? now next-match)
      (.toDurationMillis ^Interval (t/interval now next-match))
      0)))

(defn start-match []
  (if (empty? @current-standoff)
    (start-first-match)
    (start-next-match)))

(defn get-current-match []
  (let [standoff @current-standoff
        time-left (calc-match-time-left)]
    {:standoff standoff :time-left time-left}))

(defn vote! [id]
  (swap! current-standoff #(map (fn [comp] (inc-vote id comp)) %)))