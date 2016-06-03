(ns bob-poc.match.match-timer-spec
  (:require [speclj.core :refer :all]
            [bob-poc.match.match-timer :as match-timer]
            [bob-poc.match.match-service :as match-service]
            [clj-time.core :as t]))

(describe "match timer"
  (before (match-service/reset-all-data!))
  (after (match-timer/destroy-match-loop!))

  (it "should start match automatically"
    (should= {:standoff [], :match 0, :time 0} (match-service/get-current-match))
    (match-timer/init-match-loop! (t/millis 50) (t/millis 50))
    (should= true (> (count (:standoff (match-service/get-current-match))) 0)))

  (it "should start next match after timeout and between wait"
    (match-timer/init-match-loop! (t/millis 50) (t/millis 50))
    (let [first-match (match-service/get-current-match)]
      (Thread/sleep 200)
      (should-not= first-match (match-service/get-current-match)))))