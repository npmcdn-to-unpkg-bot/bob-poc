(ns match-service-spec
  (:require [speclj.core :refer :all]
            [bob-poc.match.match-service :as match-service]
            [clj-time.core :as t]
            [bob-poc.application.data :as data]))

(defn insert-test-bands []
  (data/add-new-song! "testband1" "bandimage1.jpg" "http://blaablaablaa1")
  (data/add-new-song! "testband2" "bandimage2.jpg" "http://blaablaablaa2"))

(describe "match service"
  (before (match-service/reset-all-data!)
          (insert-test-bands))

  (it "should start a new match"
    (should= {:standoff [], :match 0, :time 0} (match-service/get-current-match))
    (match-service/start-match! (t/seconds 15))
    (let [current-match (match-service/get-current-match)]
      (should= true (> (count (:standoff current-match)) 0))
      (should= 1 (:match current-match))
      (should= true (> (:time current-match) 0))))

  (it "should increase vote for a band"
    (match-service/start-match! (t/seconds 15))
    (let [current-match (match-service/get-current-match)
          band (first (:standoff current-match))
          votes (:votes band)
          band-id (:id band)]
      (should= 0 votes)
      (match-service/vote! band-id)
      (match-service/vote! band-id)
      (match-service/vote! band-id)
      (let [updated-band (first (filter #(= (:id %) band-id) (:standoff (match-service/get-current-match))))
            votes (:votes updated-band)]
        (println updated-band)
        (should= 3 votes))))

  (it "should start a next match when called"
    (match-service/start-match! (t/seconds 15))
    (let [first-match (match-service/get-current-match)]
      (should= 1 (:match first-match))
      (match-service/start-match! (t/seconds 15))
      (let [new-match (match-service/get-current-match)]
        (should-not= first-match new-match)
        (should= 2 (:match new-match)))))

  (it "should return current standoff"
    (match-service/start-match! (t/seconds 15))
    (let [current-match (match-service/get-current-match)]
      (should= {:standoff [{:id 2 :name "testband2" :soundcloud "http://blaablaablaa2" :image "bandimage2.jpg" :votes 0}
                           {:id 1 :name "testband1" :soundcloud "http://blaablaablaa1" :image "bandimage1.jpg" :votes 0}]
                :match 1 :time 15000}
               current-match))))