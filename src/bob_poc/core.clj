(ns bob-poc.core
  (:gen-class)
  (:require [clojure.tools.logging :refer [info error]]
            [ring.adapter.jetty :as jetty]
            [bob-poc.routes.handler :refer [app]]
            [bob-poc.match.match-service :as match]
            [clj-time.core :as t]
            [clojure.core.async :refer :all])
  (:import [java.lang Runtime Thread]))

(def ^:private app-server (atom nil))
(def ^:private match-loop (atom nil))

(def ^:private match-duration (t/seconds 15))

(def ^:private between-match-wait (t/seconds 5))

(defn- start-match-loop []
  (match/start-match! match-duration)
  
  (let [stop (chan)
        time-in-ms 20000]
    (go-loop []
       (alt!
         (timeout time-in-ms) (do (<! (thread (match/start-match! match-duration)))
                                (recur))
         stop :stop))
    stop))

(defn- start-server []
  (info "Starting BoB-POC...")
  (reset! app-server (jetty/run-jetty app {:max-threads 100 :port 3399 :join? false}))
  (reset! match-loop (start-match-loop))
  (info "React test started successfully!"))

(defn- stop-server []
  (info "Stopping BoB-POC...")
  (close! @match-loop)
  (.stop @app-server)
  (info "BoB-POC stopped successfully!"))

(defn -main []
  (try
    (start-server)
    (.addShutdownHook (Runtime/getRuntime) (Thread. stop-server))
    (catch Exception e
      (do (error "Error happened in main" e) (throw e)))))