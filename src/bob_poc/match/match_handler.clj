(ns bob-poc.match.match-handler
  (:require [org.httpkit.server :refer :all]
            [clojure.tools.logging :refer [debug]]
            [cheshire.core :refer [generate-string]]
            [clojure.core.async :refer :all]))

(def clients (atom {}))

(defn match-ws-handler
  [req]
  (with-channel req con
                (swap! clients assoc con true)
                (println con " connected")
                (on-close con (fn [status]
                                (swap! clients dissoc con)
                                (println con " disconnected. status: " status)))))

(defn send-new-data-to-clients [data]
  (doseq [client @clients]
    (send! (key client) (generate-string data)
           false)))