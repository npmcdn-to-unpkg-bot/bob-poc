(ns bob-poc.match.match-timer
  (:require [bob-poc.match.match-service :as match]
            [clojure.tools.logging :refer [info error]]
            [clj-time.core :as t]
            [clojure.core.async :refer :all]))

(def ^:private match-loop (atom nil))

(defn- start-match-loop [match-duration between-match-wait]
  (match/start-match! match-duration)

  (let [stop (chan)
        time-in-ms (t/in-millis (.plus match-duration between-match-wait))]
    (go-loop []
             (alt!
               (timeout time-in-ms) (do (<! (thread (match/start-match! match-duration)))
                                        (recur))
               stop :stop))
    stop))

(defn init-match-loop! [match-duration between-match-wait]
  (info "Initializing match loop with duration" match-duration "and wait" between-match-wait)
  (reset! match-loop (start-match-loop match-duration between-match-wait)))

(defn destroy-match-loop! []
  (info "Destroying match loop")
  (let [curr-match-loop @match-loop]
    (if curr-match-loop (close! curr-match-loop)))
  (reset! match-loop nil))
