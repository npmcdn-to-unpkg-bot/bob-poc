(ns bob-poc.application.data
  (:require [clojure.tools.logging :refer [info error debug]]))

(def ^:private current-bands (atom []))
(def ^:private waiting-list (atom []))

(defn get-bands []
  @current-bands)

(defn current-waiting-list-size []
  (count @waiting-list))

(defn start-new! []
  (let [new-bands @waiting-list]
    (reset! current-bands new-bands)
    (reset! waiting-list [])))

(defn add-new-song! [band-name band-image stream-url]
  (let [id (inc (current-waiting-list-size))
        new-band {:id id :name band-name :soundcloud stream-url :image band-image :votes 0}]
    (swap! waiting-list conj new-band)
    (info @waiting-list)
    (if (= (current-waiting-list-size) 2)
      (start-new!))
    new-band))