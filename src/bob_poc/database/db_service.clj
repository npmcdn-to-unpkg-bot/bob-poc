(ns bob-poc.database.db-service
  (:require [clj-time.core :as t]))

(def ^:private bands (atom [{:id 1 :band-name "Metallica" :facebook "http://facebook.com/metallica"}
                            {:id 2 :band-name "Slipknot" :facebook "http://facebook.com/slipknot"}
                            {:id 3 :band-name "Foo Fighters" :facebook "http://facebook.com/foofighters"}
                            {:id 4 :band-name "Gojira" :facebook "http://facebook.com/gojira"}]))

(def ^:private match-duration (t/minutes 2))

(def ^:private current-standoff (atom []))

(def ^:private next-match-start (atom nil))

(defn- reset-next-match-start! []
  (reset! next-match-start (t/plus (t/now) match-duration)))

(defn- select-band! []
  (let [band (rand-nth @bands)]
    (swap! bands remove band)
    band))

(defn- start-first-match []
  (let [first-band (select-band!)
        second-band (select-band!)]
    (reset! current-standoff [(conj first-band :votes 0) (conj second-band :votes 0)])
    (reset-next-match-start!)))

(defn- start-next-match []
  (let [winner (apply max-key :votes @current-standoff)
        competitor (select-band!)]
    (reset! current-standoff [(conj winner :votes 0) (conj competitor :votes 0)])
    (reset-next-match-start!)))

(defn- inc-vote [id band]
  (if (= id (:id band))
    (update-in band [:vote] inc)
    band))

(defn start-match []
  (if (empty? @current-standoff)
    start-first-match
    start-next-match))

(defn vote! [id]
  (swap! current-standoff map inc-vote id))