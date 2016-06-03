(ns bob-poc.core
  (:gen-class)
  (:require [clojure.tools.logging :refer [info error]]
            [bob-poc.routes.handler :refer [app]]
            [clj-time.core :as t]
            [bob-poc.application.properties :as properties]
            [org.httpkit.server :refer :all]
            [bob-poc.match.match-timer :as match-timer])
  (:import [java.lang Runtime Thread]))

(def ^:private app-server (atom nil))

(def ^:private match-duration (t/seconds 15))
(def ^:private between-match-wait (t/seconds 5))

(defn- start-server! []
  (info "Starting BoB-POC...")
  (reset! app-server (run-server app {:max-threads 100 :port (properties/parse-property :server-port) :join? false}))
  (match-timer/init-match-loop! match-duration between-match-wait)
  (info "React test started successfully!"))

(defn- stop-server! []
  (info "Stopping BoB-POC...")
  (match-timer/destroy-match-loop!)
  (.stop @app-server)
  (info "BoB-POC stopped successfully!"))

(defn -main []
  (info "BoB-POC envionment and version:" properties/current-version)
  (properties/print-properties)

  (try
    (start-server!)
    (.addShutdownHook (Runtime/getRuntime) (Thread. stop-server!))
    (catch Exception e
      (do (error "Error happened in main" e) (throw e)))))