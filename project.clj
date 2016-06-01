(defproject bob-poc "0.1.0-SNAPSHOT"
  :description "Proof of consept: Battle of Bands"
  :min-lein-version "2.5.1"
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [clj-time "0.11.0"] ; required due to bug in `lein-ring uberwar`
                 [org.clojure/core.async "0.2.374"]
                 [metosin/compojure-api "1.1.1"]
                 [ring/ring-jetty-adapter "1.4.0"]
                 [org.clojure/tools.logging "0.3.1"]
                 [ch.qos.logback/logback-core "1.1.3"]
                 [ch.qos.logback/logback-classic "1.1.3"]
                 [net.logstash.logback/logstash-logback-encoder "4.5.1"]
                 [environ "1.0.3"]]
  :plugins [[lein-ring "0.9.7"]
            [lein-environ "1.0.3"]
            [speclj "3.3.1"]]
  :ring {:init bob-poc.core/init-match-loop!
         :destroy bob-poc.core/destroy-match-loop!
         :handler bob-poc.routes.handler/app
         :port 3399
         :reload-paths ["src/"]}
  :uberjar-name "server.jar"
  :source-paths ["src/"]
  :resource-paths ["resources/"]
  :profiles
  {:dev-server {:env {:environment "dev"}}
   :dev {:resource-paths ["spec/testfiles/"]
         :env {:environment "dev-test"}
         :dependencies [[ring/ring-mock "0.3.0"]
                        [speclj "3.3.1"]
                        [speclj-junit "0.0.10"]]}}
  :aliases {"test" ["with-profile" "dev" "spec" "-f" "d"]
            "server" ["with-profile" "dev-server" "ring" "server"]
            "server-headless" ["with-profile" "dev-server" "ring" "server-headless"]}
  :test-paths ["spec"]
  :main bob-poc.core)
