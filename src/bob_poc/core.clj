(ns bob-poc.core
  (:gen-class)
  (:require [clojure.tools.logging :refer [info error]]
            [bob-poc.routes.handler :refer [app]]
            [bob-poc.match.match-service :as match]
            [clj-time.core :as t]
            [bob-poc.application.properties :refer :all]
            [clojure.core.async :refer :all]
            [org.httpkit.server :refer :all])
  (:import [java.lang Runtime Thread]))

(def ^:private app-server (atom nil))
(def ^:private match-loop (atom nil))

(def ^:private match-duration (t/seconds 15))
(def ^:private between-match-wait (t/seconds 5))

(defn- start-match-loop []
  (match/start-match! match-duration)

  (let [stop (chan)
        time-in-ms (t/in-millis (.plus match-duration between-match-wait))]
    (go-loop []
       (alt!
         (timeout time-in-ms) (do (<! (thread (match/start-match! match-duration)))
                                (recur))
         stop :stop))
    stop))

(defn init-match-loop! []
  (info "Initializing match loop")
  (reset! match-loop (start-match-loop)))

(defn destroy-match-loop! []
  (info "Destroying match loop")
  (close! @match-loop))

(defn- start-server! []
  (info "Starting BoB-POC...")
  (reset! app-server (run-server app {:max-threads 100 :port (parse-property :port) :join? false}))
  (init-match-loop!)
  (info "React test started successfully!"))

(defn- stop-server! []
  (info "Stopping BoB-POC...")
  (destroy-match-loop!)
  (.stop @app-server)
  (info "BoB-POC stopped successfully!"))

(defn -main []
  (info "BoB-POC envionment and version:" current-version)
  (print-properties)

  (try
    (start-server!)
    (.addShutdownHook (Runtime/getRuntime) (Thread. stop-server!))
    (catch Exception e
      (do (error "Error happened in main" e) (throw e)))))